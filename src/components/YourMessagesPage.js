import { useState, useEffect } from "react";
import { getMessages } from "../utils/Contract";
import { Grid } from "@mui/material";
import SideBar from "./SideBar";
import MessageList from "./MessageList";
import SelectedMessage from "./SelectedMessage";
import Filters from "./Filters";
import MessageTools from "./MessageTools";

const YourMessagesPage = (props) => {
  const { walletProvider, walletAddress } = props;
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
      console.log("receivedMessageArray", receivedMessageArray);
      if (filterBy === "All") {
        setData(receivedMessageArray);
      } else if (filterBy === "Active") {
        const result = receivedMessageArray.filter((message) => {
          let timeStamp = message.timestamp.toString();
          // converts it to milliseconds
          timeStamp = timeStamp * 1000;

          // convert it to day, then add 7 days
          let deadlineDay = new Date(timeStamp);
          deadlineDay.setHours(deadlineDay.getHours() + 168);

          const date1 = new Date(deadlineDay);
          const date2 = new Date();
          const remainder = (date1 - date2) / 1000 / 60 / 60 / 24;
          return remainder > 0;
        });

        setData(result);
      } else if (filterBy === "Claimed") {
        const result = receivedMessageArray.filter(
          (message) => message.claimed === true
        );
        console.log("should not dispplay res", result);
        setData(result);
      } else if (filterBy === "Expired") {
        const result = receivedMessageArray.filter((message) => {
          let timeStamp = message.timestamp.toString();
          // converts it to milliseconds
          timeStamp = timeStamp * 1000;

          // convert it to day, then add 7 days
          let deadlineDay = new Date(timeStamp);
          deadlineDay.setHours(deadlineDay.getHours() + 168);

          const date1 = new Date(deadlineDay);
          const date2 = new Date();
          const remainder = (date1 - date2) / 1000 / 60 / 60 / 24;
          console.log(
            "🚀 ~ file: YourMessagesPage.js ~ line 78 ~ result ~ remainder",
            remainder
          );
          return remainder < 0;
        });
        setData(result);
      }
    } else {
      // FOR SENT MESSAGE
      console.log("sentMessagesArray", sentMessagesArray);
      if (filterBy === "All") {
        setData(sentMessagesArray);
      } else if (filterBy === "Active") {
        const result = sentMessagesArray.filter((message) => {
          let timeStamp = message.timestamp.toString();
          // converts it to milliseconds
          timeStamp = timeStamp * 1000;

          // convert it to day, then add 7 days
          let deadlineDay = new Date(timeStamp);
          deadlineDay.setHours(deadlineDay.getHours() + 168);

          const date1 = new Date(deadlineDay);
          const date2 = new Date();
          const remainder = (date1 - date2) / 1000 / 60 / 60 / 24;
          return remainder > 0;
        });

        setData(result);
      } else if (filterBy === "Claimed") {
        const result = sentMessagesArray.filter(
          (message) => message.claimed === true
        );
        console.log("should not dispplayres", result);
        setData(result);
      }

      // come back to this
      else if (filterBy === "Expired") {
        const result = sentMessagesArray.filter((message) => {
          let timeStamp = message.timestamp.toString();
          // converts it to milliseconds
          timeStamp = timeStamp * 1000;

          // convert it to day, then add 7 days
          let deadlineDay = new Date(timeStamp);
          deadlineDay.setHours(deadlineDay.getHours() + 168);

          const date1 = new Date(deadlineDay);
          const date2 = new Date();
          const remainder = (date1 - date2) / 1000 / 60 / 60 / 24;
          return remainder < 0;
        });
        setData(result);
      }
    }
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
    };
    fetchMessages();
  }, []);

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
          <SelectedMessage selectedMessage={selectedMessage} />
        </Grid>
      </Grid>

      {/* old */}
      <div className="text-center text-2xl">Your Messages!</div>
      <div className="text-xl">Received</div>
      {/* {receivedMessages.map((receivedMessage) => {
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
      })} */}
    </div>
  );
};

export default YourMessagesPage;
