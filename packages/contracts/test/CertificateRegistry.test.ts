import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CertificateRegistry } from "../typechain-types"; // ✅ استيراد الـ types

describe("CertificateRegistry", function () {
  // Fixture لإعادة نشر العقد قبل كل test
  async function deployCertificateRegistryFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const CertificateRegistryFactory = await ethers.getContractFactory(
      "CertificateRegistry",
    );
    const registry =
      (await CertificateRegistryFactory.deploy()) as CertificateRegistry; // ✅ type assertion
    return { registry, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { registry, owner } = await loadFixture(
        deployCertificateRegistryFixture,
      );
      expect(await registry.owner()).to.equal(owner.address);
    });
  });

  describe("Issuance", function () {
    it("Should allow the owner to issue a certificate", async function () {
      const { registry } = await loadFixture(deployCertificateRegistryFixture);
      const ipfsCID = "Qm...testCID";

      await expect(registry.issue(ipfsCID))
        .to.emit(registry, "CertificateIssued")
        .withArgs(0, ipfsCID);

      const [storedCID, status] = await registry.verify(0);
      expect(storedCID).to.equal(ipfsCID);
      expect(status).to.equal(0); // Status.ISSUED
    });

    it("Should not allow another account to issue a certificate", async function () {
      const { registry, otherAccount } = await loadFixture(
        deployCertificateRegistryFixture,
      );
      const ipfsCID = "Qm...testCID";

      await expect(registry.connect(otherAccount).issue(ipfsCID))
        .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });
  });

  describe("Revocation", function () {
    it("Should allow the owner to revoke a certificate", async function () {
      const { registry } = await loadFixture(deployCertificateRegistryFixture);
      const ipfsCID = "Qm...testCID";

      await registry.issue(ipfsCID);

      await expect(registry.revoke(0))
        .to.emit(registry, "CertificateRevoked")
        .withArgs(0);

      const [, status] = await registry.verify(0);
      expect(status).to.equal(1); // Status.REVOKED
    });

    it("Should not allow another account to revoke a certificate", async function () {
      const { registry, otherAccount } = await loadFixture(
        deployCertificateRegistryFixture,
      );

      await registry.issue("Qm...testCID");

      await expect(registry.connect(otherAccount).revoke(0))
        .to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });

    it("Should revert when trying to revoke a non-existent certificate", async function () {
      const { registry } = await loadFixture(deployCertificateRegistryFixture);

      await expect(registry.revoke(999)).to.be.revertedWith(
        "CertificateRegistry: Certificate does not exist",
      );
    });

    it("Should revert when trying to revoke an already revoked certificate", async function () {
      const { registry } = await loadFixture(deployCertificateRegistryFixture);

      await registry.issue("Qm...testCID");
      await registry.revoke(0);

      await expect(registry.revoke(0)).to.be.revertedWith(
        "CertificateRegistry: Certificate already revoked",
      );
    });
  });

  describe("Verification", function () {
    it("Should return the correct data for an existing certificate", async function () {
      const { registry } = await loadFixture(deployCertificateRegistryFixture);
      const ipfsCID = "Qm...testCID";

      await registry.issue(ipfsCID);

      const [storedCID, status] = await registry.verify(0);
      expect(storedCID).to.equal(ipfsCID);
      expect(status).to.equal(0); // Status.ISSUED
    });

    it("Should revert when verifying a non-existent certificate", async function () {
      const { registry } = await loadFixture(deployCertificateRegistryFixture);

      await expect(registry.verify(999)).to.be.revertedWith(
        "CertificateRegistry: Certificate does not exist",
      );
    });
  });
});
