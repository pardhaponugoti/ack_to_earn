// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract AckToEarn is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    event BidClaimed(address indexed recipient, uint bidId);
    event BidReclaimed(address indexed bidder, uint amount);
    event FundsWithdrawn(address indexed account, uint amount);
    event NewBid(address indexed from, address indexed to, uint amount);

    Counters.Counter private bidIds;

    struct Bid {
        uint id;
        uint recipientAmount;
        uint timestamp;
        address bidder;
        address recipient;
        string responseEmailAddress;
        string message;
        string fileCid;
        bool claimed;
        bool exists;
    }

    mapping(address => mapping(uint => Bid)) private bidderBids;
    mapping(address => mapping(uint => Bid)) private recipientBids;
    mapping(address => uint) public balances;
    mapping(address => uint) public minimumPaymentAmounts;

    Bid[] public bids;

    uint constant bidExpiryThreshold = 7 days;

    /*
    * ==================================================================================================================
    *                                               BIDDER FUNCTIONS
    * ==================================================================================================================
    */

    /**
    * @notice Send a message and bid amount to a recipient
    */
    function sendBid(string memory message, address recipient, string memory responseAddress, string memory fileCid) external payable {
        require(recipient != address(0), "Recipient cannot be the zero address");
        require(
            // If the recipient doesn't have a minimum payment set then the mapping returns 0
            msg.value >= minimumPaymentAmounts[recipient],
            "Ether value does not meet the recipient's minimum message amount"
        );

        // The recipient gets 90% of the bid amount
        uint recipientAmount = (msg.value * 90) / 100;
        uint ownerAmount = msg.value - recipientAmount;

        uint newBidId = bidIds.current();
        Bid memory bid = Bid({
            id: newBidId,
            recipientAmount: recipientAmount,
            timestamp: block.timestamp,
            bidder: msg.sender,
            recipient: recipient,
            responseEmailAddress: responseAddress,
            message: message,
            fileCid: fileCid,
            claimed: false,
            exists: true
        });

        bids.push(bid);

        bidderBids[msg.sender][newBidId] = bid;
        recipientBids[recipient][newBidId] = bid;
        balances[owner()] = ownerAmount;

        emit NewBid(msg.sender, recipient, msg.value);
    }

    /**
    * @notice Reclaims a specific set of expired bids that the bidder has made.
    */
    function reclaimBids(uint[] memory bidIdsToReclaim) external nonReentrant {
        uint totalReclaimAmount = 0;

        for (uint i = 0; i < bidIdsToReclaim.length; i++)
        {
            uint bidId = bidIdsToReclaim[i];
            Bid memory bid = bidderBids[msg.sender][bidId];

            if (!bid.exists) {
                continue;
            }
            // If balance of this bid has already been claimed, don't allow the eth to be reclaimed
            if (bid.claimed) {
                continue;
            }
            // If the bid has not expired yet then don't allow the balance to be reclaimed
            if (!isBidExpired(bidId, msg.sender)) {
                continue;
            }

            totalReclaimAmount += bid.recipientAmount;
            bidderBids[msg.sender][bidId].claimed = true;
        }

        require(totalReclaimAmount > 0, "No ether to reclaim.");

        (bool success, ) = (msg.sender).call{value: totalReclaimAmount}("");

        require(success, "Failed to send ether");

        emit BidReclaimed(msg.sender, totalReclaimAmount);
    }

    /*
    * ==================================================================================================================
    *                                                  RECIPIENT FUNCTIONS
    * ==================================================================================================================
    */

    /**
    * @notice Allows a recipient to acknowledge a message / bid and adds the bid amount to their contract balance
    */
    function claimBid(uint bidId) public {
        Bid memory bid = recipientBids[msg.sender][bidId];

        require(bid.exists, "Bid not found");
        require(!bid.claimed, "Bid balance has already been claimed");
        require(!isBidExpired(bidId, msg.sender), "Bid is expired");

        recipientBids[msg.sender][bidId].claimed = true;
        balances[msg.sender] += bid.recipientAmount;

        emit BidClaimed(msg.sender, bid.recipientAmount);
    }

    /**
    * @notice Allows recipients to specify a minimum amount for messages
    */
    function setMinimumPaymentAmount(uint amount) external {
        minimumPaymentAmounts[msg.sender] = amount;
    }

    /**
    * @notice Allows funds to be withdrawn from the account's contract balance
    */
    function withdrawFunds(uint amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Tried to withdraw more funds than the account's balance");

        balances[msg.sender] -= amount;
        (bool success, ) = (msg.sender).call{value: amount}("");

        require(success, "Failed to withdraw funds");

        emit FundsWithdrawn(msg.sender, amount);
    }

    /*
    * ==================================================================================================================
    *                                                   GENERAL FUNCTIONS
    * ==================================================================================================================
    */

    /**
    * @notice Returns all bids that have ever been made on the platform
    */
    function getBids() external view returns(Bid[] memory) {
        return bids;
    }

    /**
    * @notice Check if bid is expired
    * @dev Returns true if the bid cannot be found
    */
    function isBidExpired(uint bidId, address account) internal view returns(bool) {
        bool isBidderAccount = bidderBids[account][bidId].exists;
        bool isRecipientAccount = recipientBids[account][bidId].exists;

        if (isBidderAccount) {
            return (block.timestamp >= (bidderBids[account][bidId].timestamp + bidExpiryThreshold));
        }
        if (isRecipientAccount) {
            return (block.timestamp >= (recipientBids[account][bidId].timestamp + bidExpiryThreshold));
        }

        return true;
    }
}
