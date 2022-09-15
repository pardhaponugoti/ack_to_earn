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

    fetchMessages();
  });

  const sentMessages = allMessages.filter(
    (message) => message.bidder === walletAddress
  );
  const receivedMessages = allMessages.filter(
    (message) => message.recipient === walletAddress
  );

  return (
    <div>
      <div className="text-center text-2xl">Your Messages!</div>
      <div className="text-xl">Received</div>
      {receivedMessages.map((receivedMessage) => {
        return (
          <div className="py-3">
            <div>{`Recipient: ${receivedMessage.recipient}`}</div>
            <div>{`Bidder: ${receivedMessage.bidder}`}</div>
            <div>{`Message: ${receivedMessage.message}`}</div>
            <div>{`Email: ${receivedMessage.responseEmailAddress}`}</div>
          </div>
        );
      })}
      <div className="text-xl">Sent</div>
      {sentMessages.map((sentMessage) => {
        return (
          <div className="py-3">
            <div>{`Recipient: ${sentMessage.recipient}`}</div>
            <div>{`Bidder: ${sentMessage.bidder}`}</div>
            <div>{`Message: ${sentMessage.message}`}</div>
            <div>{`Email: ${sentMessage.responseEmailAddress}`}</div>
          </div>
        );
      })}
    </div>
  );
};

export default YourMessagesPage;
