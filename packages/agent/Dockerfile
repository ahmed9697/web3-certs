# Use an official lightweight Python image.
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the ABI file and the application code
COPY ../shared/src/CertificateRegistry.abi.json ./packages/shared/src/CertificateRegistry.abi.json
COPY . .

# Command to run the worker script when the container launches
CMD ["python", "-u", "worker.py"]