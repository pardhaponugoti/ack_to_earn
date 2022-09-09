// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract AckToEarn is Ownable {
    event NewBid(address indexed from, address indexed to, uint amount);

    struct Bid {
        address bidder;
        uint amount;
        string message;
        uint timestamp;
        bool claimed;
    }

    mapping(address => Bid[]) private bidderBids;
    mapping(address => Bid[]) private recipientBids;
    mapping(address => uint) private recipientUnclaimedBalances;

    /**
    * @notice Send a message and bid amount to a recipient
    */
    function sendBid(string memory message, address recipient) external payable {
        require(recipient != address(0), "Recipient cannot be the zero address");

        // The recipient gets 90% of the bid amount
        uint recipientAmount = (msg.value * 90) / 100;

        // Adds the new bid to the list of bids for this bidder
        bidderBids[msg.sender].push(Bid({
            bidder: msg.sender,
            amount: msg.value,
            message: message,
            timestamp: block.timestamp,
            claimed: false
        }));

        // Adds the new bid to the list of bids for this recipient
        recipientBids[recipient].push(Bid({
            bidder: msg.sender,
            amount: msg.value,
            message: message,
            timestamp: block.timestamp,
            claimed: false
        }));

        recipientUnclaimedBalances[recipient] += recipientAmount;

        emit NewBid(msg.sender, recipient, msg.value);
    }

    /**
    * @notice Get the unclaimed balance for an account
    */
    function getRecipientUnclaimedBalance(address recipient) public view returns(uint) {
        return recipientUnclaimedBalances[recipient];
    }
}
