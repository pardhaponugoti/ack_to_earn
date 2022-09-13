import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { PAGE_ROUTE_SEND_MESSAGE } from "../constants/Routing";

const HowItWorksPage = () => {
  return (
    <div style={{ width: "60%", margin: "0 auto" }}>
      <h4>Ack-to-earn lets you get in touch with great engineers</h4>
      <div>
        For <strong style={{ color: "purple" }}>Senders</strong>
      </div>
      <ol style={{ textAlign: "left" }}>
        <li>Connect your wallet</li>
        <li>
          Fill in the recipient's wallet, your message, bid amount, and response
          address
        </li>
        <li>
          Send your message! Recipients have 7 days to acknowledge a message or
          the bid is returned to the sender
        </li>
      </ol>
      <div>
        For <strong style={{ color: "purple" }}>Recipients</strong>
      </div>
      <ol style={{ textAlign: "left" }}>
        <li>Connect your wallet</li>
        <li>See your messages</li>
        <li>Acknowledge messages you have received to claim bids</li>
        <li>Claim your earnings</li>
      </ol>
      <Link to={PAGE_ROUTE_SEND_MESSAGE}>
        <Button>Get started</Button>
      </Link>
    </div>
  );
};

export default HowItWorksPage;
