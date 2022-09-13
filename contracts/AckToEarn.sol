// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract AckToEarn is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    event NewBid(address indexed from, address indexed to, uint amount);
    event ReclaimBid(address indexed bidder, uint amount);

    Counters.Counter private bidIds;

    struct Bid {
        uint id;
        address bidder;
        address recipient;
        uint recipientAmount;
        uint timestamp;
        string message;
        bool claimed;
        bool exists;
    }

    mapping(address => mapping(uint => Bid)) private bidderBids;
    mapping(address => mapping(uint => Bid)) private recipientBids;

    Bid[] public bids;

    uint constant bidExpiryThreshold = 7 days;

    /**
    * @notice Send a message and bid amount to a recipient
    */
    function sendBid(string memory message, address recipient) external payable {
        require(recipient != address(0), "Recipient cannot be the zero address");

        uint newBidId = bidIds.current();
        Bid memory bid = Bid({
            id: newBidId,
            bidder: msg.sender,
            recipient: recipient,
            // The recipient gets 90% of the bid amount
            recipientAmount: (msg.value * 90) / 100,
            message: message,
            timestamp: block.timestamp,
            claimed: false,
            exists: true
        });

        bids.push(bid);

        bidderBids[msg.sender][newBidId] = bid;
        recipientBids[recipient][newBidId] = bid;

        emit NewBid(msg.sender, recipient, msg.value);
    }

    /**
    * @notice Returns all bids that have ever been made on the platform
    */
    function getBids() external view returns(Bid[] memory) {
        return bids;
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

        require(success, "Failed to send ether.");

        emit ReclaimBid(msg.sender, totalReclaimAmount);
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
