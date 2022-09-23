import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import CircularProgress from "@mui/material/CircularProgress";

import "./SendMessage.css";
import question from "../../images/question.png";
import { sendMessage } from "../../utils/Contract";
import { getStorageClient } from "../../utils/FileStorage";
import { resolveUrl } from "../../utils/UnstoppableDomains";

function SendMessage(props) {
  const { walletProvider, transactionCount, setTransactionCount } = props;
  const [recipientWallet, setRecipientWallet] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryParams = useLocation().search;
  // eslint-disable-next-line no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  const storageClient = getStorageClient();

  useEffect(() => {
    if (queryParams) {
      const specifiedAddress = new URLSearchParams(queryParams).get("to");
      setSearchParams({});
      setRecipientWallet(specifiedAddress);
    }
  }, [queryParams, setSearchParams]);

  const send = async (e) => {
    let fileCid = "";

    e.preventDefault();
    if (attachedFile) {
      const fileInput = document.querySelector('input[type="file"]');
      const rootCid = await storageClient.put(fileInput.files);
      const info = await storageClient.status(rootCid);
      fileCid = info.cid;
    }

    setIsLoading(true);

    const resolvedEnsAddress = await getResolvedEnsAddress();
    const resolvedUnstoppableDomainsAddress = await resolveUrl(recipientWallet);
    let recipientWalletAddress = recipientWallet;

    if (resolvedEnsAddress) {
      recipientWalletAddress = resolvedEnsAddress;
    } else if (resolvedUnstoppableDomainsAddress) {
      recipientWalletAddress = resolvedUnstoppableDomainsAddress;
    }

    const sendMessageResult = await sendMessage(
      walletProvider,
      message,
      recipientWalletAddress,
      email,
      fileCid,
      bidAmount
    );

    if (sendMessageResult && sendMessageResult.status === 1) {
      setRecipientWallet("");
      setMessage("");
      setEmail("");
      setBidAmount("");
      setAttachedFile(null);

      // TODO: add success state
    } else {
      // TODO: set error state with descriptive error message
    }

    setTransactionCount(transactionCount + 1);
    setIsLoading(false);
  };

  const getResolvedEnsAddress = async () => {
    const ethereum = await detectEthereumProvider();
    const provider = new ethers.providers.Web3Provider(ethereum, "any");

    return await provider.resolveName(recipientWallet);
  };

  if (!walletProvider) {
    return (
      <div className="text-center text-2xl">Please connect your wallet</div>
    );
  }

  return (
    <div className="bg-blue-100 h-screen pt-4">
      <div className="mt-8 max-w-md mx-auto w-1/2 border-solid border-2  p-16 box-shadow: 0 0 24px rgba(0, 0, 0, 0.1)  bg-white">
        {isLoading && (
          <div className="text-center absolute top-[50%] right-[49%]">
            <CircularProgress />
          </div>
        )}
        <div className="grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-gray-700">Recipient's wallet address</span>
            <input
              type="text"
              className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
              placeholder="0x11..A31"
              onChange={(e) => setRecipientWallet(e.target.value)}
              value={recipientWallet}
              disabled={isLoading}
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Message</span>
            <textarea
              className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
              rows={3}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              disabled={isLoading}
              placeholder="your message..."
            />
          </label>

          <label className="block">
            <div className="img__wrap flex">
              <span className="text-gray-700">Response address </span>
              <div>
                <img className="img__img" src={question} alt="question" />
                <p className="img__description">
                  An email address they can reply to
                </p>
              </div>
            </div>

            <input
              type="email"
              className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
              placeholder="johndoe@example.com"
              onChange={(e) => setEmail(e.target.value)}
              id="exampleEmail0"
              value={email}
              disabled={isLoading}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Bid amount (ETH)</span>
            <input
              type="number"
              className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
              placeholder="1"
              min="0"
              onChange={(e) => setBidAmount(e.target.value)}
              value={bidAmount}
              disabled={isLoading}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Attach a file (optional)</span>
            <input
              type="file"
              className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
              onChange={(e) => {
                setAttachedFile(e.target.files[0]);
              }}
              disabled={isLoading}
            />
          </label>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={send}
            disabled={isLoading}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendMessage;
