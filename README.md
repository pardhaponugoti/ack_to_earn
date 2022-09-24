# [ack_to_earn](https://ack-to-earn.web.app/)

**Note**

This is currently live on the Rinkeby chain. When connecting your wallet to the dapp, please choose the Rinkeby Test Network and get some free Rinkeby Eth from a [faucet](https://faucets.chain.link/) if you don't have any.

## Overview

Welcome to Ack to Earn! This dapp allows web3 users to pay others to read messages sent to their wallets. It also incorporates ENS and Unstoppable Domains to allow them to be messaged with their usernames on those platforms.

_So it's just a messaging app? Why does it need to be on the ethereum chain?_

Great question! Ack to Earn forces the sender to pay the recipient a fee when they acknowledge a message they have been sent. This logic is built into a smart contract that handles the payment mechanisms.

_Why would anyone ever pay to send someone a message?_

Another great question! Funny enough, **this already happens**! Recruiters use products such as InMail, paying LinkedIn to message people on the platform. However, they don't have a guarantee that the recipient will read their message.

Rather than paying a platform like LinkedIn, why not pay the end user directly for their time? We think that people will be less likely to ignore your message since they're getting paid to read it. Moreover, with Ack to Earn, the sender only pays when the recipient actively acknowledges their message, otherwise the sender can reclaim their ether tied to the message.

_Ok, I think I get it but can you run that by me once more?_

Absolutely! With Ack to Earn, you can send someone a message and pay them when they acknowledge your message. We think this is better than traditional cold outreach because:

- The recipient is more likely to read a message they are getting paid to look at. They should be paid directly for their time, not a third party platform.
- The sender only pays when a recipient acknowledges their message. If the recipient doesn't acknowledge a message within 7 days the sender can reclaim their ETH. This means no wasted money on people who ignore your messages.

## How it works

### Sending messages

In order to send a message, head over to [ack-to-earn.web.app/send](https://ack-to-earn.web.app/send).

On this page, you'll see a form where you can specify the recipient, add a message, share an email they can reply to you at, specify a bid amount (how much they will be paid in ETH), and optionally attach a file - Thanks Filecoin! Note that the smart contract takes 10% of the bid as a fee.

<img width="400" alt="Screen Shot 2022-09-24 at 4 52 17 PM" src="https://user-images.githubusercontent.com/14807133/192118423-21c9c88b-68dd-4833-87e5-6be4dcb76340.png">

### Reviewing messages

In order to send a message, go to [ack-to-earn.web.app/messages](https://ack-to-earn.web.app/messages).

Here you'll see an inbox view of all your messages. Acknowledge a message to accrue an ether balance in the smart contract.

<img width="800" alt="Screen Shot 2022-09-24 at 4 58 32 PM" src="https://user-images.githubusercontent.com/14807133/192118576-0b7af526-9613-4844-8a28-0984694f7164.png">

### Claiming your balance

The last (and best) part! You've acknowledged messages and have earned some ether. Go to [ack-to-earn.web.app/balance](https://ack-to-earn.web.app/balance) to get it.

<img width="400" alt="Screen Shot 2022-09-24 at 5 01 47 PM" src="https://user-images.githubusercontent.com/14807133/192118655-1b51af98-7fc5-428c-b895-3c229a27214b.png">

## Code Overview

The smart contract is [AckToEarn.sol](https://github.com/pardhaponugoti/ack_to_earn/blob/main/contracts/AckToEarn.sol). It stores all of the messages that were sent and their status, along with ether balances for all of the users.

The frontend is written in React and can be viewed in the [src](https://github.com/pardhaponugoti/ack_to_earn/tree/main/src) folder.

**Note that this is only live on Rinkeby at this point in time**

### Technologies Used

#### IPFS/Filecoin

Web3Storage allows users to attach files to messages. This could be useful when sending a resume or more rich media on the platform.

#### ENS

Our ENS integration allows users to be messaged via their `.eth` domains.

#### Unstoppable Domains

Our Unstoppable Domains integration allows users to be messaged via their Unstoppable Domains domain name.
