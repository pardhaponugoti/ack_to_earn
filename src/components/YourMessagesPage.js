import { useState, useEffect } from "react";
import { getMessages } from "../utils/Contract";

// https://dweb.link/ipfs/YOUR_CID

const YourMessagesPage = (props) => {
  const { walletProvider, walletAddress } = props;

  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(walletProvider);
      setAllMessages(messages);
    };

    if (walletProvider) {
      fetchMessages();
    }
  }, [walletProvider]);

  const sentMessages = allMessages.filter(
    (message) => message.bidder === walletAddress
  );
  const receivedMessages = allMessages.filter(
    (message) => message.recipient === walletAddress
  );

  if (!walletProvider) {
    return (
      <div className="text-center text-2xl">Please connect your wallet</div>
    );
  }

  const formatMessage = (message) => {
    return (
      <div className="py-3">
        <div>{`Recipient: ${message.recipient}`}</div>
        <div>{`Bidder: ${message.bidder}`}</div>
        <div>{`Message: ${message.message}`}</div>
        <div>{`Email: ${message.responseEmailAddress}`}</div>
        {message.fileCid && (
          <div>
            File:{" "}
            <a
              target="_blank"
              href={`https://dweb.link/ipfs/${message.fileCid}`}
              className="text-blue-700 underline"
            >
              Link
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="text-center text-2xl">Your Messages!</div>
      <div className="text-xl">Received</div>
      {receivedMessages.map((receivedMessage) =>
        formatMessage(receivedMessage)
      )}
      <div className="text-xl">Sent</div>
      {sentMessages.map((sentMessage) => formatMessage(sentMessage))}
    </div>
  );
};

export default YourMessagesPage;
