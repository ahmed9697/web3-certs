import os
import json
import redis # pyright: ignore[reportMissingImports]
import time
import requests
from dotenv import load_dotenv
from web3 import Web3
from pydantic import BaseModel, HttpUrl, Field
from typing import List

# --- PYDANTIC MODELS FOR VC VALIDATION (NEW) ---
class Degree(BaseModel):
    name: str
    subject: str

class CredentialSubject(BaseModel):
    id: str
    name: str
    degree: Degree

class VerifiableCredentialModel(BaseModel):
    context: List[str] = Field(..., alias='@context')
    type: List[str]
    issuer: str
    issuanceDate: str
    credentialSubject: CredentialSubject

# --- CONFIGURATION ---
print("Loading configuration...")
load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "127.0.0.1")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
QUEUE_NAME = "bull:certificate-issuance:wait"
RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
SIGNER_PRIVATE_KEY = os.getenv("SIGNER_PRIVATE_KEY")
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_API_SECRET = os.getenv("PINATA_API_SECRET")
PINATA_UPLOAD_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
API_FINALIZE_URL = "http://localhost:3001/certificates/{}/finalize"

# --- HELPER FUNCTIONS ---
def get_contract_abi():
    abi_path = os.path.join(os.path.dirname(__file__), '..', '..', 'packages', 'shared', 'src', 'CertificateRegistry.abi.json')
    with open(abi_path) as f:
        return json.load(f)

def generate_vc(cert_data):
    print(f"  > Generating Verifiable Credential for {cert_data['studentName']}...")
    return {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": ["VerifiableCredential", "AcademicCertificate"],
        "issuer": "University of Web3",
        "issuanceDate": cert_data['issueDate'],
        "credentialSubject": {
            "id": f"did:example:{cert_data['studentEmail']}",
            "name": cert_data['studentName'],
            "degree": { "name": cert_data['degreeName'], "subject": cert_data['degreeSubject'] }
        }
    }

def upload_to_ipfs(vc_json):
    print(f"  > Uploading VC to IPFS via Pinata...")
    headers = {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_API_SECRET,
    }
    response = requests.post(PINATA_UPLOAD_URL, headers=headers, json=vc_json)
    response.raise_for_status()
    ipfs_hash = response.json()["IpfsHash"]
    print(f"  > Successfully uploaded to IPFS. CID: {ipfs_hash}")
    return ipfs_hash

# --- MAIN WORKER LOOP ---
def main():
    print("Initializing connections...")
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    signer = w3.eth.account.from_key(SIGNER_PRIVATE_KEY)
    w3.eth.default_account = signer.address
    contract_abi = get_contract_abi()
    registry_contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

    print(f"\n✅ Worker is fully initialized.")
    print(f"   - Listening for jobs on Redis list: {QUEUE_NAME}")
    # ... (other startup messages)

    while True:
        try:
            # ... (code to get job from Redis remains the same)
            job_tuple = r.brpop(QUEUE_NAME)
            if not job_tuple: continue
            job_id = job_tuple[1]
            job_key = f"bull:certificate-issuance:{job_id}"
            job_data_str = r.hget(job_key, "data")
            if not job_data_str: continue
            cert_data = json.loads(job_data_str)
            cert_db_id = cert_data.get("id")
            print(f"\n--- PROCESSING JOB {job_id} (Cert ID: {cert_db_id}) ---")

            # 1. Generate Verifiable Credential
            vc = generate_vc(cert_data)

            # 2. AI VALIDATION STEP (NEW)
            try:
                VerifiableCredentialModel.model_validate(vc)
                print("  > ✅ VC data is valid according to the Pydantic schema.")
            except Exception as e:
                print(f"  > ❌ ERROR: VC data is invalid! Reason: {e}")
                raise e # Stop processing this job

            # 3. Upload VC to IPFS
            ipfs_cid = upload_to_ipfs(vc)

            # 4. Issue on Blockchain
            # ... (rest of the blockchain and API callback logic remains the same)
            print(f"  > Preparing blockchain transaction...")
            nonce = w3.eth.get_transaction_count(signer.address)
            tx = registry_contract.functions.issue(ipfs_cid).build_transaction({
                'from': signer.address, 'nonce': nonce,
            })
            signed_tx = w3.eth.account.sign_transaction(tx, private_key=SIGNER_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            if receipt.status != 1: raise Exception("Blockchain transaction failed!")
            tx_hash_hex = tx_hash.hex()
            print(f"  > Blockchain transaction successful! Hash: {tx_hash_hex}")

            # 5. Finalize status by calling API back
            print(f"  > Calling API to finalize status for Cert ID: {cert_db_id}...")
            finalize_payload = {"ipfsCID": ipfs_cid, "transactionHash": tx_hash_hex}
            requests.patch(API_FINALIZE_URL.format(cert_db_id), json=finalize_payload)

            print(f"--- ✅ JOB {job_id} COMPLETED SUCCESSFULLY ---\n")

        except Exception as e:
            print(f"--- ❌ JOB FAILED ---")
            print(f"An error occurred: {e}")
            print(f"---------------------\n")
            time.sleep(5)

if __name__ == "__main__":
    main()