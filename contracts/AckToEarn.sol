// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract AckToEarn is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    event BidClaimed(address indexed recipient, uint256 bidId);
    event BidReclaimed(address indexed bidder, uint256 amount);
    event FundsWithdrawn(address indexed account, uint256 amount);
    event NewBid(address indexed from, address indexed to, uint256 amount);

    Counters.Counter private bidIds;

    struct Bid {
        uint256 id;
        uint256 recipientAmount;
        uint256 timestamp;
        address bidder;
        address recipient;
        string responseEmailAddress;
        string message;
        string fileCid;
        bool claimed;
        bool exists;
    }

    mapping(address => uint256) public balances;
    mapping(address => uint256) public minimumPaymentAmounts;

    Bid[] public bids;

    uint256 constant bidExpiryThreshold = 7 days;

    /*
     * ==================================================================================================================
     *                                               BIDDER FUNCTIONS
     * ==================================================================================================================
     */

    /**
     * @notice Send a message and bid amount to a recipient
     */
    function sendBid(
        string memory message,
        address recipient,
        string memory responseAddress,
        string memory fileCid
    ) external payable {
        require(
            recipient != address(0),
            "Recipient cannot be the zero address"
        );
        require(
            // If the recipient doesn't have a minimum payment set then the mapping returns 0
            msg.value >= minimumPaymentAmounts[recipient],
            "Ether value does not meet the recipient's minimum message amount"
        );

        // The recipient gets 90% of the bid amount
        uint256 recipientAmount = (msg.value * 90) / 100;
        uint256 ownerAmount = msg.value - recipientAmount;

        uint256 newBidId = bids.length;
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

        balances[owner()] += ownerAmount;

        emit NewBid(msg.sender, recipient, msg.value);
    }

    /**
     * @notice Reclaims a specific set of expired bids that the bidder has made.
     */
    function reclaimBids(uint256[] memory bidIdsToReclaim)
        external
        nonReentrant
    {
        uint256 totalReclaimAmount = 0;

        for (uint256 i = 0; i < bidIdsToReclaim.length; i++) {
            uint256 bidId = bidIdsToReclaim[i];
            Bid memory bid = bids[bidId];

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
            // Require the reclaimer to be the bidder
            require(
                bid.bidder == msg.sender,
                "Cannot reclaim a bid you didn't send"
            );

            totalReclaimAmount += bid.recipientAmount;
            bids[bidId].claimed = true;
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
    function claimBid(uint256 bidId) public {
        Bid memory bid = bids[bidId];

        require(bid.exists, "Bid not found");
        require(!bid.claimed, "Bid balance has already been claimed");
        require(!isBidExpired(bidId, msg.sender), "Bid is expired");
        // Require the reclaimer to be the bidder
        require(
            bid.recipient == msg.sender,
            "Cannot reclaim a bid you didn't receive"
        );

        bids[bidId].claimed = true;
        balances[msg.sender] += bid.recipientAmount;

        emit BidClaimed(msg.sender, bid.recipientAmount);
    }

    /**
     * @notice Allows recipients to specify a minimum amount for messages
     */
    function setMinimumPaymentAmount(uint256 amount) external {
        minimumPaymentAmounts[msg.sender] = amount;
    }

    /**
     * @notice Allows funds to be withdrawn from the account's contract balance
     */
    function withdrawFunds(uint256 amount) external nonReentrant {
        require(
            balances[msg.sender] >= amount,
            "Tried to withdraw more funds than the account's balance"
        );

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
    function getBids() external view returns (Bid[] memory) {
        return bids;
    }

    /**
     * @notice Check if bid is expired
     * @dev Returns true if the bid cannot be found
     */
    function isBidExpired(uint256 bidId, address account)
        internal
        view
        returns (bool)
    {
        Bid memory bid = bids[bidId];
        bool isBidderAccount = bid.bidder == account;
        bool isRecipientAccount = bid.recipient == account;

        if (isBidderAccount) {
            return (block.timestamp >= (bid.timestamp + bidExpiryThreshold));
        }
        if (isRecipientAccount) {
            return (block.timestamp >= (bid.timestamp + bidExpiryThreshold));
        }

        return true;
    }
}
