from fastapi import FastAPI

app = FastAPI(
    title="Web3 Certificates AI Agent",
    version="1.0",
)

@app.get("/")
def read_root():
    return {"status": "AI Agent is running"}