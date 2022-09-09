const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("AckToEarn", function () {
  async function deployAckToEarnFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const AckToEarnFactory = await ethers.getContractFactory("AckToEarn");
    const ackToEarn = await AckToEarnFactory.deploy();

    return { ackToEarn, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { ackToEarn, owner } = await loadFixture(deployAckToEarnFixture);

      expect(await ackToEarn.owner()).to.equal(owner.address);
    });
  });

  describe("Recipient", function () {
    it("Should be able to see unclaimed balance", async function () {
      const { ackToEarn, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");
      const recipientAmount = (bidAmount * 90) / 100;

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      expect(await ackToEarn.getUnclaimedBalance(otherAccount.address))
          .to.equal(recipientAmount.toString());
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { ackToEarn, owner, otherAccount } = await loadFixture(deployAckToEarnFixture);
        const bidAmount = ethers.utils.parseEther("1");

        expect(await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount}))
            .to.emit(ackToEarn, "NewBid")
            .withArgs(owner.address, otherAccount, bidAmount);
      });
    });
  });
});
