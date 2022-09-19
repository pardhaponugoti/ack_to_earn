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
    setReceivedMessagesBalance,
    setSentMessagesBalance,
  } = props;
  const [selectedMessage, setSelectedMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [data, setData] = useState([]);
  const [sentMessages, setSendMessages] = useState([]);
  const [activeLink, setActiveLink] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const selectData = async (messageType) => {
    setActiveLink(messageType);
    if (messageType === "Inbox") setData(receivedMessages);
    if (messageType === "Sent") setData(sentMessages);
  };

  const selectDataByCategory = async (filterBy) => {
    const sentMessagesArray = allMessages.filter(
      (message) => message.bidder === walletAddress
    );
    const receivedMessageArray = allMessages.filter(
      (message) => message.recipient === walletAddress
    );
    setFilterCategory(filterBy);

    if (activeLink === "Inbox") {
      if (filterBy === "All") {
        setData(receivedMessageArray);
      } else if (filterBy === "Active") {
        setData(getActiveMessages(receivedMessageArray));
      } else if (filterBy === "Claimed") {
        setData(getClaimedMessages(receivedMessageArray));
      } else if (filterBy === "Expired") {
        setData(getExpiredMessages(receivedMessageArray));
      }
    } else {
      // SENT MESSAGE
      if (filterBy === "All") {
        setData(sentMessagesArray);
      } else if (filterBy === "Active") {
        setData(getActiveMessages(sentMessagesArray));
      } else if (filterBy === "Claimed") {
        setData(getClaimedMessages(sentMessagesArray));
      } else if (filterBy === "Expired") {
        setData(getExpiredMessages(sentMessagesArray));
      }
    }
  };

  const getActiveMessages = (listArray) => {
    return listArray.filter((message) => {
      let timeStamp = message.timestamp.toString();
      timeStamp = timeStamp * 1000;
      let deadlineDay = new Date(timeStamp);
      deadlineDay.setHours(deadlineDay.getHours() + 168);
      const date1 = new Date(deadlineDay);
      const date2 = new Date();
      const remainder = (date1 - date2) / 1000 / 60 / 60 / 24;
      return remainder > 0;
    });
  };

  const getClaimedMessages = (listArray) => {
    return listArray.filter((message) => message.claimed === true);
  };

  const getExpiredMessages = (listArray) => {
    return listArray.filter((message) => {
      let timeStamp = message.timestamp.toString();
      timeStamp = timeStamp * 1000; //converts it to milliseconds
      let deadlineDay = new Date(timeStamp);
      deadlineDay.setHours(deadlineDay.getHours() + 168); // add 7 days
      const date1 = new Date(deadlineDay);
      const date2 = new Date();
      const remainder = (date1 - date2) / 1000 / 60 / 60 / 24;
      return remainder < 0;
    });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(walletProvider);
      setAllMessages(messages);
      const sent = messages.filter(
        (message) => message.bidder === walletAddress
      );
      setSendMessages(sent);
      const received = messages.filter(
        (message) => message.recipient === walletAddress
      );

      setReceivedMessages(received);
      getMessagesBalance("sent", sent);
      getMessagesBalance("received", received);
    };
    fetchMessages();
  }, []);

  const getMessagesBalance = async (listType, listArray) => {
    let balance = 0;
    for (let i = 0; i < listArray.length; i++) {
      const currentBalance = listArray[i].recipientAmount.toString() / 10 ** 18;
      balance += +currentBalance;
    }
    if (listType === "sent") setSentMessagesBalance(balance);
    else {
      setReceivedMessagesBalance(balance);
    }
  };

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
              rel="noreferrer"
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
    <div className=" pt-4">
      <Grid container spacing={0} className="bg-blue-100 align-middle p-1">
        <Grid item xs={2}></Grid>
        <Grid item xs={3}>
          <Filters
            filterCategory={filterCategory}
            selectDataByCategory={selectDataByCategory}
          />
        </Grid>
        <Grid item xs={7}>
          <MessageTools />
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid item xs={2}>
          <SideBar
            selectData={selectData}
            setActiveLink={setActiveLink}
            activeLink={activeLink}
          />
        </Grid>
        <Grid item xs={3}>
          <MessageList
            data={data}
            setSelectedMessage={setSelectedMessage}
            selectedMessage={selectedMessage}
          />
        </Grid>
        <Grid item xs={7}>
          <SelectedMessage
            selectedMessage={selectedMessage}
            walletProvider={walletProvider}
            walletAddress={walletAddress}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default YourMessagesPage;
