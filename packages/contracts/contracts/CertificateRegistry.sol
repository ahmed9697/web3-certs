// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificateRegistry
 * @dev A smart contract to issue, revoke, and verify academic certificates.
 */
contract CertificateRegistry is Ownable {
    enum Status {
        ISSUED,
        REVOKED
    }

    struct Certificate {
        string ipfsCID;
        Status status;
    }

    uint256 private _nextCertificateId;
    mapping(uint256 => Certificate) public certificates;

    event CertificateIssued(uint256 indexed certificateId, string ipfsCID);
    event CertificateRevoked(uint256 indexed certificateId);

    constructor() Ownable(msg.sender) {}

    function issue(string memory _ipfsCID) public onlyOwner returns (uint256) {
        uint256 certificateId = _nextCertificateId;
        certificates[certificateId] = Certificate({
            ipfsCID: _ipfsCID,
            status: Status.ISSUED
        });
        _nextCertificateId++;
        emit CertificateIssued(certificateId, _ipfsCID);
        return certificateId;
    }

    function revoke(uint256 _certificateId) public onlyOwner {
        Certificate storage certificate = certificates[_certificateId];

        require(bytes(certificate.ipfsCID).length > 0, "CertificateRegistry: Certificate does not exist");
        require(certificate.status != Status.REVOKED, "CertificateRegistry: Certificate already revoked");

        certificate.status = Status.REVOKED;
        emit CertificateRevoked(_certificateId);
    }

    function verify(uint256 _certificateId) public view returns (string memory, Status) {
        require(bytes(certificates[_certificateId].ipfsCID).length > 0, "CertificateRegistry: Certificate does not exist");
        Certificate memory certificate = certificates[_certificateId];
        return (certificate.ipfsCID, certificate.status);
    }
}