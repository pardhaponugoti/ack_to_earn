import { useState, useEffect } from "react";
import { getMessages } from "../utils/Contract";
import { Grid } from "@mui/material";
import SideBar from "./SideBar";
import MessageList from "./MessageList";
import SelectedMessage from "./SelectedMessage";
import Filters from "./Filters";
import MessageTools from "./MessageTools";

const YourMessagesPage = (props) => {
  const {
    walletProvider,
    walletAddress,
    transactionCount,
    setTransactionCount,
  } = props;
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [messageType, setMessageType] = useState("Inbox");
  const [filterCategory, setFilterCategory] = useState("All");

  const isMessageExpired = (message) => {
    let timeStamp = message.timestamp.toString();
    timeStamp = timeStamp * 1000; //converts it to milliseconds
    let deadlineDay = new Date(timeStamp);
    deadlineDay.setHours(deadlineDay.getHours() + 168); // add 7 days
    const date1 = new Date(deadlineDay);
    const date2 = new Date();
    const remainder = (date1 - date2) / 1000 / 60 / 60 / 24;
    return remainder < 0;
  };

  const setFilterCategoryAndResetMessage = (filterCategory) => {
    setFilterCategory(filterCategory);
    setSelectedMessage(null);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(walletProvider);
      const yourMessages = messages
        .filter((message) => {
          return (
            message.bidder === walletAddress ||
            message.recipient === walletAddress
          );
        })
        .map((message) => {
          return {
            expired: isMessageExpired(message),
            ...message,
          };
        });

      setAllMessages(yourMessages);
    };

    if (walletProvider) {
      fetchMessages();
    }
  }, [walletProvider, walletAddress, transactionCount]);

  if (!walletProvider) {
    return (
      <div className="text-center text-2xl">Please connect your wallet</div>
    );
  }

  let filteredMessages = allMessages;

  // Filter by message type
  if (messageType === "Inbox") {
    filteredMessages = filteredMessages.filter(
      (message) => message.recipient === walletAddress
    );
  }
  if (messageType === "Sent") {
    filteredMessages = filteredMessages.filter(
      (message) => message.bidder === walletAddress
    );
  }

  // Filter by category
  if (filterCategory === "Active") {
    filteredMessages = filteredMessages.filter((message) => !message.expired);
  }
  if (filterCategory === "Expired") {
    filteredMessages = filteredMessages.filter((message) => message.expired);
  }
  if (filterCategory === "Claimed") {
    filteredMessages = filteredMessages.filter((message) => message.claimed);
  }

  return (
    <div className=" pt-4">
      <Grid container spacing={0} className="bg-blue-100 align-middle p-1">
        <Grid item xs={2}></Grid>
        <Grid item xs={3}>
          <Filters
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategoryAndResetMessage}
          />
        </Grid>
        <Grid item xs={7}>
          <MessageTools />
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid item xs={2}>
          <SideBar setMessageType={setMessageType} messageType={messageType} />
        </Grid>
        <Grid item xs={3}>
          <MessageList
            data={filteredMessages}
            setSelectedMessage={setSelectedMessage}
            selectedMessage={selectedMessage}
          />
        </Grid>
        <Grid item xs={7}>
          <SelectedMessage
            selectedMessage={selectedMessage}
            walletProvider={walletProvider}
            walletAddress={walletAddress}
            transactionCount={transactionCount}
            setTransactionCount={setTransactionCount}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default YourMessagesPage;
