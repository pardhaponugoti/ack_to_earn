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
  amount
) => {
  const ackToEarnContract = getContract(walletProvider);

  try {
    const transaction = await ackToEarnContract.sendBid(
      message,
      recipient,
      responseEmailAddress,
      { value: ethers.utils.parseEther(amount.toString()) }
    );
    const returnValue = await transaction.wait();

    return returnValue;
  } catch (err) {
    console.log("AckToEarn sendMessage transaction failed", err);
  }
};
