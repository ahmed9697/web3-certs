-- CreateEnum
CREATE TYPE "public"."CertificateStatus" AS ENUM ('PENDING', 'ISSUED', 'REVOKED');

-- CreateTable
CREATE TABLE "public"."Certificate" (
    "id" SERIAL NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "degreeName" TEXT NOT NULL,
    "degreeSubject" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."CertificateStatus" NOT NULL DEFAULT 'PENDING',
    "ipfsCID" TEXT,
    "transactionHash" TEXT,
    "issuerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_ipfsCID_key" ON "public"."Certificate"("ipfsCID");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_transactionHash_key" ON "public"."Certificate"("transactionHash");

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
