Web3 Academic Certificate PlatformThis project is a secure, scalable, and verifiable platform for issuing, verifying, and revoking academic certificates. It leverages a hybrid on-chain/off-chain model to ensure data privacy, security, and cost-effectiveness.The on-chain smart contract acts as a registry, storing only essential, non-sensitive data, while the full certificate details are stored off-chain on IPFS as a W3C Verifiable Credential. An intelligent Python agent orchestrates the complex workflow of issuance, IPFS upload, and blockchain interaction.Architecture OverviewThe platform is built on a modern microservices architecture within a pnpm monorepo managed by Turborepo.Frontend (apps/web): A Next.js application that provides the admin dashboard for issuing certificates and a public portal for verification.Backend API (apps/api): A NestJS server that handles user authentication, manages the database, and dispatches jobs to a queue.AI Agent (packages/agent): A Python service (FastAPI/Worker) that processes asynchronous jobs. It generates Verifiable Credentials, uploads them to IPFS, and interacts with the smart contract.Smart Contracts (packages/contracts): A Solidity-based Hardhat project for the on-chain CertificateRegistry contract.Database (PostgreSQL): Stores user data and certificate metadata. Managed via Prisma.Queue (Redis): Manages the job queue between the API and the Agent using BullMQ.Tech StackAreaTechnologyMonorepopnpm Workspaces, TurborepoFrontendNext.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/uiBackendNestJS, TypeScript, Prisma ORM, BullMQAgentPython 3.11, FastAPI, Pydantic, Web3.py, Redis-pyBlockchainSolidity 0.8.x, Hardhat, OpenZeppelin ContractsDatabasePostgreSQLQueue/CacheRedisStorageIPFS (via Pinata)DevOpsDocker, Docker Compose, GitHub ActionsPrerequisitesBefore you begin, ensure you have the following tools installed on your local machine:Node.js (v20 or higher)pnpm (v9 or higher)Python (v3.11)Docker Desktop (latest version)Getting Started: Local SetupFollow these steps to set up and run the project on your local machine.1. Clone the Repositorygit clone [https://github.com/ahmed9697/web3-certs.git](https://github.com/ahmed9697/web3-certs.git)
cd web3-certs
2. Install DependenciesInstall all dependencies for the entire monorepo with a single command from the root directory:pnpm install
3. Configure Environment VariablesYou will need to create three separate .env files for the different services.A. Backend API SecretsCreate a file at: apps/api/.envAdd your cloud database URL and a JWT secret:# Example using a Neon database
DATABASE_URL="postgresql://user:password@.../neondb?schema=public&sslmode=require"
# A long, random string for signing JWTs
JWT_SECRET="your-super-secret-key-that-is-at-least-32-chars-long"
B. Smart Contract SecretsCreate a file at: packages/contracts/.envAdd your blockchain RPC URL and deployer private key:AMOY_RPC_URL="YOUR_ALCHEMY_OR_INFURA_HTTPS_URL"
DEPLOYER_PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"
C. Agent SecretsCreate a file at: packages/agent/.envAdd all the connection details for the agent.# Redis Connection
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Blockchain Connection (for local development)
RPC_URL="[http://127.0.0.1:8545](http://127.0.0.1:8545)"
CONTRACT_ADDRESS="YOUR_LOCALLY_DEPLOYED_CONTRACT_ADDRESS"
SIGNER_PRIVATE_KEY="PRIVATE_KEY_OF_A_HARDHAT_NODE_ACCOUNT"

# Pinata IPFS Service
PINATA_API_KEY="YOUR_PINATA_API_KEY"
PINATA_API_SECRET="YOUR_PINATA_API_SECRET"
Running the Application for DevelopmentTo run the full application, you will need four separate terminals.Terminal 1: Start the Local Blockchain# Navigate to the contracts package
cd packages/contracts

# Start the local node
pnpm hardhat node
This will provide a local blockchain and a list of funded accounts. Copy the private key of one of these accounts into your packages/agent/.env file.Terminal 2: Deploy the Smart Contract# Navigate to the contracts package
cd packages/contracts

# Deploy the contract to the local node
pnpm hardhat run scripts/deploy.ts --network localhost
Copy the deployed contract address and paste it into your packages/agent/.env file.Terminal 3: Start Background Services# Navigate to the project root
cd ../.. 

# Start Redis and PostgreSQL (optional, if not using a cloud DB)
docker compose up -d
Terminal 4: Start the API, Frontend, and AgentThis is the main development command. We will run the API and Frontend using Turborepo, and the agent in a separate process.Start the API and Frontend:From the project root, run:# This will start the NestJS API on port 3001 and the Next.js app on port 3000
pnpm dev
Start the Python Agent:Open a new terminal window.Navigate to the agent's directory: cd packages/agentActivate the virtual environment: .\venv\Scripts\Activate.ps1Run the worker: python worker.pyAt this point, the entire application is running. You can access the web dashboard at http://localhost:3000.Project Structureweb3-certs/
├── apps/
│   ├── api/          # NestJS Backend API
│   └── web/          # Next.js Frontend
├── packages/
│   ├── agent/        # Python AI Agent
│   ├── contracts/    # Solidity Smart Contracts
│   └── shared/       # Shared code (e.g., contract ABI)
├── .github/
│   └── workflows/    # GitHub Actions CI/CD
├── docker-compose.yml
├── .gitignore
├── package.json
└── README.md
Web3 Academic Certificate Platform1. Project Vision & OverviewThis project is a complete, secure, and scalable platform for issuing, verifying, and revoking academic certificates. It uses a modern hybrid on-chain/off-chain architecture to ensure data privacy and integrity while minimizing blockchain transaction costs. A unique cryptographic fingerprint of each certificate is stored immutably on the blockchain, while the full certificate data (as a Verifiable Credential) is stored on the InterPlanetary File System (IPFS).This provides a tamper-proof system that employers and institutions can use for instant, trusted verification of academic credentials.2. System ArchitectureThe platform is designed with a modern microservice architecture, promoting clear separation of concerns and scalability.Frontend (apps/web): A Next.js 14 application with a React-based admin dashboard for issuing certificates and a public-facing portal for verification.Backend API (apps/api): A robust NestJS server that handles user authentication, database management (via Prisma), and dispatches jobs to a processing queue.AI Agent (packages/agent): An intelligent Python service that operates asynchronously. It processes jobs from the Redis queue, generates Verifiable Credentials, uploads them to IPFS, and orchestrates all smart contract interactions.Smart Contract (packages/contracts): The CertificateRegistry.sol contract, written in Solidity, which serves as the on-chain source of truth for all issued certificates.3. Technology StackDomainTechnologyMonorepo Managementpnpm Workspaces, TurborepoFrontendNext.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/uiBackend APINestJS, TypeScript, Prisma ORM, BullMQAI AgentPython 3.11, FastAPI, Pydantic, Web3.py, Redis-pyBlockchainSolidity 0.8.26, Hardhat, OpenZeppelinDatabasePostgreSQLJob Queue / CacheRedisDecentralized StorageIPFS (via Pinata)DevOpsDocker, Docker Compose, GitHub Actions4. Local Development Setup GuideFollow these steps to set up and run the entire project on your local machine.PrerequisitesEnsure you have the following tools installed:Node.js (v20+)pnpm (v9+)Python (v3.11)Docker DesktopSetup InstructionsClone the Repository:git clone [https://github.com/ahmed9697/web3-certs.git](https://github.com/ahmed9697/web3-certs.git)
cd web3-certs
Install Dependencies:From the project root, run the master install command:pnpm install
Configure Environment Variables (.env files):You must create three separate .env files and populate them with your secret keys.a. Backend API (apps/api/.env):# Get this from a free cloud provider like Neon.tech
DATABASE_URL="postgresql://user:password@.../neondb?schema=public&sslmode=require"
b. Smart Contracts (packages/contracts/.env):# For deploying to a public testnet like Amoy
AMOY_RPC_URL="YOUR_ALCHEMY_HTTPS_URL_FOR_AMOY"
DEPLOYER_PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY_FOR_DEPLOYMENT"
c. AI Agent (packages/agent/.env):REDIS_HOST=127.0.0.1
REDIS_PORT=6379
RPC_URL="[http://127.0.0.1:8545](http://127.0.0.1:8545)"
CONTRACT_ADDRESS="YOUR_LOCALLY_DEPLOYED_CONTRACT_ADDRESS"
SIGNER_PRIVATE_KEY="A_PRIVATE_KEY_FROM_THE_HARDHAT_NODE_LIST"
PINATA_API_KEY="YOUR_PINATA_API_KEY"
PINATA_API_SECRET="YOUR_PINATA_API_SECRET"
Running the ApplicationYou will need four separate terminals to run the complete system.Terminal 1: Background Services (Docker)# From the project root
docker compose up -d
Terminal 2: Local Blockchain Node# Navigate to the contracts package
cd packages/contracts
# Start the local node
pnpm hardhat node
(Keep this terminal running).Terminal 3: API & Frontend Servers# From the project root (run as administrator if you have permission issues)
pnpm dev
Frontend will be available at: http://localhost:3000Backend API will be available at: http://localhost:3001Terminal 4: AI Agent# Navigate to the agent package
cd packages/agent
# Activate the virtual environment
.\venv\Scripts\Activate.ps1
# Run the worker
python worker.py
You can now access the admin dashboard at http://localhost:3000 and use the full application.5. ConclusionThis project successfully demonstrates the power of a hybrid Web3 architecture for building real-world, secure, and scalable applications. The foundation is robust and ready for future expansion with more advanced features.