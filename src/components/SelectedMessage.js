import { useEffect, useState } from "react";
import { claimBalance } from "../utils/Contract";
import { Button, CardContent, Typography } from "@mui/material";
import download from "../images/download.png";
import Moment from "react-moment";

function SelectedMessage(props) {
  const {
    walletProvider,
    selectedMessage,
    transactionCount,
    setTransactionCount,
  } = props;
  const [deadline, setDeadline] = useState("1");

  useEffect(() => {
    const getDays = () => {
      let timeStamp = selectedMessage?.timestamp.toString();
      // converts it to milliseconds
      timeStamp = timeStamp * 1000;
      // convert it to day, then add 7 days
      let deadlineDay = new Date(timeStamp);
      deadlineDay.setHours(deadlineDay.getHours() + 168);

      const date1 = new Date(deadlineDay);
      const date2 = new Date();
      const reminder = Math.floor((date1 - date2) / 1000 / 60 / 60 / 24);
      setDeadline(reminder);
    };

    if (selectedMessage) {
      getDays();
    }
    // eslint-disable-next-line no-use-before-define
  }, [selectedMessage]);

  const claimMessageBalance = async (message) => {
    await claimBalance(walletProvider, message.id.toNumber());
    setTransactionCount(transactionCount + 1);
  };

  return (
    <div>
      {selectedMessage ? (
        <div
          sx={{ minWidth: 275 }}
          style={{
            padding: "2rem",
            backgroundColor: "#f9f9f9",
            height: "88vh",
          }}
        >
          <CardContent>
            <div style={{ textAlign: "right", paddingBottom: "0.5rem" }}>
              <Button
                style={{
                  fontSize: "0.7rem",
                  backgroundColor: "green",
                  color: "white",
                  textTransform: "none",
                }}
              >
                {deadline} day to read
              </Button>
            </div>
            <div className="flex items-start justify-between">
              <Typography noWrap sx={{ mb: 1.5 }} color="text.primary">
                <strong>Date:</strong>{" "}
                <Moment format=" MM-DD-YYYY HH:mm">
                  {selectedMessage.timestamp}
                </Moment>
              </Typography>
              <p
                style={{
                  color: "#d80606",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                }}
              >
                {selectedMessage.recipientAmount.toString() / 10 ** 18} Eth
              </p>
            </div>
            <Typography noWrap sx={{ mb: 1.5 }} color="text.primary">
              <strong>From:</strong> {selectedMessage.bidder}
            </Typography>

            <br />
            <Typography variant="body1" color="text.secondary">
              {selectedMessage.message}
            </Typography>
            <br />
            <Typography noWrap variant="body2" color="text.secondary">
              Respond to <span>{selectedMessage.responseEmailAddress}</span>
            </Typography>
            <br />

            <Button
              variant="contained"
              color="primary"
              onClick={() => claimMessageBalance(selectedMessage)}
            >
              Acknowledge this message
            </Button>
          </CardContent>
        </div>
      ) : (
        <img
          style={{
            height: "88vh",
          }}
          src={download}
          alt="download"
        />
      )}
    </div>
  );
}

export default SelectedMessage;
