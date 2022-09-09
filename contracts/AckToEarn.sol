// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract AckToEarn {
    event NewBid(address indexed from, address indexed to, uint amount);

    struct Bid {
        address bidder;
        uint amount;
        string message;
        uint timestamp;
        bool claimed;
    }

    mapping(address => Bid[]) private recipientBids;

    /**
    * @notice Send a message and bid amount to a recipient
    */
    function sendMessage(string memory message, address recipient) external payable {
        require(recipient != address(0), "Recipient cannot be the zero address");

        // The recipient gets 90% of the bid amount
        uint recipientAmount = (msg.value * 90) / 100;

        // Adds the new bid to the list of bids for this recipient
        recipientBids[recipient].push(Bid({
            bidder: msg.sender,
            amount: recipientAmount,
            message: message,
            timestamp: block.timestamp,
            claimed: false
        }));

        emit NewBid(msg.sender, recipient, msg.value);
    }
}
