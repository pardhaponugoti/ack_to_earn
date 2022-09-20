import { Button, Divider, CardContent, Typography } from "@mui/material";
import Moment from "react-moment";

function MessageList(props) {
  const { data, setSelectedMessage, selectedMessage } = props;

  return (
    <div style={{ height: "80vh", overflow: "auto" }}>
      {data ? (
        data.map((message, index) => (
          <div key={index} sx={{ minWidth: 275 }}>
            <CardContent
              className={
                selectedMessage && message.id === selectedMessage.id
                  ? "bg-blue-200"
                  : ""
              }
              onClick={() => setSelectedMessage(message)}
            >
              <div style={{ textAlign: "right", paddingBottom: "0.5rem" }}>
                <Button
                  style={{
                    fontSize: "0.7rem",
                    backgroundColor: "green",
                    color: "white",
                    textTransform: "none",
                  }}
                >
                  Expires on &nbsp;
                  <Moment add={{ day: 7 }} format=" MM-DD-YYYY HH:mm">
                    {message.timestamp}
                  </Moment>
                </Button>
              </div>
              <div className="flex items-start justify-between">
                <Typography noWrap sx={{ mb: 1.5 }} color="text.primary">
                  {message.recipient}
                </Typography>
                <p className="pl-36">
                  {message.recipientAmount.toString() / 10 ** 18}Eth
                </p>
              </div>
              <Typography noWrap variant="body2" color="text.secondary">
                {message.message}
              </Typography>
            </CardContent>
            <Divider />
          </div>
        ))
      ) : (
        <h1>No messages yet...</h1>
      )}
    </div>
  );
}

export default MessageList;
