import { ethers } from "ethers";

import {
  ACK_TO_EARN_CONTRACT_ADDRESS,
  ACK_TO_EARN_ABI,
} from "../constants/Contract";

const getContract = (walletProvider) => {
  if (!walletProvider) {
    return null;
  }

  const contract = new ethers.Contract(
    ACK_TO_EARN_CONTRACT_ADDRESS,
    ACK_TO_EARN_ABI,
    walletProvider.getSigner()
  );

  return contract;
};

export const sendMessage = async (
  walletProvider,
  message,
  recipient,
  responseEmailAddress,
  fileCid,
  amount
) => {
  const ackToEarnContract = getContract(walletProvider);

  try {
    const transaction = await ackToEarnContract.sendBid(
      message,
      recipient,
      responseEmailAddress,
      fileCid,
      { value: ethers.utils.parseEther(amount.toString()) }
    );
    const returnValue = await transaction.wait();

    return returnValue;
  } catch (err) {
    console.log("AckToEarn sendMessage transaction failed", err);
  }
};

export const getMessages = async (walletProvider) => {
  const ackToEarnContract = getContract(walletProvider);

  try {
    const messages = await ackToEarnContract.getBids();

    return messages;
  } catch (err) {
    console.log("AckToEarn getMessages transaction failed", err);
  }
};

export const claimBalance = async (walletProvider, messageId) => {
  const ackToEarnContract = getContract(walletProvider);

  try {
    const transaction = await ackToEarnContract.claimBid(messageId);
    const returnValue = await transaction.wait();

    return returnValue;
  } catch (err) {
    console.log("AckToEarn claimBalance transaction failed", err);
  }
};

export const getBalance = async (walletProvider, walletAddress) => {
  const ackToEarnContract = getContract(walletProvider);

  try {
    const balanceWei = await ackToEarnContract.balances(walletAddress);

    // Convert balance from WEI to ETH
    return ethers.utils.formatEther(balanceWei);
  } catch (err) {
    console.log("AckToEarn getBalance transaction failed", err);
  }
};

export const withdrawFunds = async (walletProvider, balance) => {
  const ackToEarnContract = getContract(walletProvider);

  try {
    const transaction = await ackToEarnContract.withdrawFunds(
      ethers.utils.parseEther(balance.toString())
    );
    const returnValue = await transaction.wait();

    return returnValue;
  } catch (err) {
    console.log("AckToEarn withdrawFunds transaction failed", err);
  }
};
