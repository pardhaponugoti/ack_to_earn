const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

// Seven days
const bidExpiryThreshold = 7 * 24 * 60 * 60;

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

  describe("Bidder", function () {
    it("Should be able to reclaim bid amounts.", async function () {
      const { ackToEarn, owner, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");
      const reclaimAmount = (bidAmount * 90) / 100;

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      // Increase the EVM time by the bid expiry threshold (7 days)
      await ethers.provider.send('evm_increaseTime', [bidExpiryThreshold]);
      await ethers.provider.send('evm_mine');

      const bids = await ackToEarn.getBids();
      let bidderBidIds = [];

      bids.forEach(bid => {
        if (bid.bidder === owner.address) {
          bidderBidIds.push(ethers.BigNumber.from(bid.id).toNumber());
        }
      });

      // Ensure the bidder's wallet balance is updated with the correct amount of ether
      expect(await ackToEarn.reclaimBids(bidderBidIds)).to.changeEtherBalance(owner, reclaimAmount.toString());

      // Ensure the bidder cannot reclaim the same bid multiple times
      await expect(ackToEarn.reclaimBids(bidderBidIds)).to.be.revertedWith("No ether to reclaim.");
    });
  });

  describe("Events", function () {
    it("Should emit an event on new bid", async function () {
      const { ackToEarn, owner, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");

      expect(await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount}))
          .to.emit(ackToEarn, "NewBid")
          .withArgs(owner.address, otherAccount, bidAmount);
    });


    it("Should emit an event when bids are reclaimed", async function () {
      const { ackToEarn, owner, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");
      const reclaimAmount = (bidAmount * 90) / 100;

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      // Increase the EVM time by the bid expiry threshold (7 days)
      await ethers.provider.send('evm_increaseTime', [bidExpiryThreshold]);
      await ethers.provider.send('evm_mine');

      const bids = await ackToEarn.getBids();
      let bidderBidIds = [];

      bids.forEach(bid => {
        if (bid.bidder === owner.address) {
          bidderBidIds.push(ethers.BigNumber.from(bid.id).toNumber());
        }
      });

      expect(await ackToEarn.reclaimBids(bidderBidIds))
          .to.emit(ackToEarn, "ReclaimBid")
          .withArgs(owner.address, reclaimAmount.toString());
    });
  });
});
