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

    it("Should not be able to send a message with an ETH value less than the recipent's minimum payment amount.", async function () {
      const { ackToEarn, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");

      await ackToEarn.connect(otherAccount).setMinimumPaymentAmount(ethers.utils.parseEther("2"));

      await expect(ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount}))
          .to.be.revertedWith("Ether value does not meet the recipient's minimum message amount");
    });
  });

  describe("Recipient", function () {
    it("Should be able to claim a bid", async function () {
      const { ackToEarn, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      const bids = await ackToEarn.getBids();

      await ackToEarn.connect(otherAccount).claimBid(bids[0].id);

      const newRecipientBalance = await ackToEarn.balances(otherAccount.address);

      expect(bids[0].recipientAmount).to.equal(newRecipientBalance);
    });

    it("Should not be able to claim a bid that has already been claimed", async function () {
      const { ackToEarn, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      const bids = await ackToEarn.getBids();

      await ackToEarn.connect(otherAccount).claimBid(bids[0].id);

      await expect(ackToEarn.connect(otherAccount).claimBid(bids[0].id))
          .to.be.revertedWith("Bid balance has already been claimed");
    });

    it("Should not be able to claim a bid that has expired", async function () {
      const { ackToEarn, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      const bids = await ackToEarn.getBids();

      // Increase the EVM time by the bid expiry threshold (7 days)
      await ethers.provider.send('evm_increaseTime', [bidExpiryThreshold]);
      await ethers.provider.send('evm_mine');

      await expect(ackToEarn.connect(otherAccount).claimBid(bids[0].id)).to.be.revertedWith("Bid is expired");
    });


    it("Should be able to withdraw funds", async function () {
      const { ackToEarn, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");
      const withdrawAmount = (bidAmount * 90) / 100;

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      const bids = await ackToEarn.getBids();

      await ackToEarn.connect(otherAccount).claimBid(bids[0].id);

      const newRecipientBalance = await ackToEarn.balances(otherAccount.address);

      // Ensure the recipient's wallet balance is updated with the correct amount of ether
      expect(await ackToEarn.connect(otherAccount).withdrawFunds(withdrawAmount.toString()))
          .to.changeEtherBalance(otherAccount, newRecipientBalance.toString());

      // Ensure the recipient cannot withdraw more than the recipient's contract balance
      await expect(ackToEarn.connect(otherAccount).withdrawFunds(withdrawAmount.toString()))
          .to.be.revertedWith("Tried to withdraw more funds than the account's balance");
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
          .to.emit(ackToEarn, "BidReclaimed")
          .withArgs(owner.address, reclaimAmount.toString());
    });

    it("Should emit an event on bid claimed", async function () {
      const { ackToEarn, owner, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      const bids = await ackToEarn.getBids();

      expect(await ackToEarn.connect(otherAccount).claimBid(bids[0].id))
          .to.emit(ackToEarn, "BidClaimed")
          .withArgs(owner.address, otherAccount, bidAmount);
    });

    it("Should emit an event on withdrawal", async function () {
      const { ackToEarn, otherAccount } = await loadFixture(deployAckToEarnFixture);
      const bidAmount = ethers.utils.parseEther("1");
      const withdrawAmount = (bidAmount * 90) / 100;

      await ackToEarn.sendBid("Some message", otherAccount.address, {value: bidAmount});

      const bids = await ackToEarn.getBids();

      await ackToEarn.connect(otherAccount).claimBid(bids[0].id);

      expect(await ackToEarn.connect(otherAccount).withdrawFunds(withdrawAmount.toString()))
          .to.emit(ackToEarn, "FundsWithdrawn")
          .withArgs(otherAccount.address, withdrawAmount.toString());
    });
  });
});
