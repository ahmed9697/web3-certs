# Use an official lightweight Python image.
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY packages/agent/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the ABI file from shared
COPY packages/shared/src/CertificateRegistry.abi.json ./packages/shared/src/CertificateRegistry.abi.json

# Copy the Agent source code
COPY packages/agent .

# Command to run the worker script when the container launches
CMD ["python", "-u", "worker.py"]
