import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

import { PAGE_ROUTE_SEND_MESSAGE } from "../constants/Routing";

const HowItWorksPage = () => {
  return (
    <div className="text-lg max-w-lg mx-auto">
      <h4 className="text-lg mt-8">
        Ack-to-earn lets you get in touch with great engineers
      </h4>
      <div className="mt-8 text-xl">
        For{" "}
        <strong className="text-violet-700 underline underline-offset-4">
          Senders
        </strong>
      </div>
      <ol className="list-decimal leading-loose">
        <li>Connect your wallet</li>
        <li>
          Fill in the recipient's wallet, your message, bid amount, and response
          address
        </li>
        <li>Send your message!</li>
        <li>
          Recipients have 7 days to acknowledge a message or the bid is returned
          to the sender
        </li>
      </ol>
      <div className="mt-8 text-xl">
        For{" "}
        <strong className="text-violet-700 underline underline-offset-4">
          Recipients
        </strong>
      </div>
      <ol className="list-decimal leading-loose">
        <li>Connect your wallet</li>
        <li>See your messages</li>
        <li>Acknowledge messages you have received to claim bids</li>
        <li>Claim your earnings</li>
      </ol>
      <div className="flex justify-center">
        <div className=" font-semibold rounded-xl drop-shadow-md uppercase mt-8 inline-block px-8 py-2 bg-violet-700 text-gray-100 text-bold">
          <Link to={PAGE_ROUTE_SEND_MESSAGE}>
            <div>Get started</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
