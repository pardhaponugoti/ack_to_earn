import React, { useState } from "react";
import "./SendMessage.css";
import question from "../../images/question.png";
function SendMessage() {
  const [recipientWallet, setRecipientWallet] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(" all", recipientWallet, message, email, bidAmount);
  };

  return (
    <div className="mt-8 max-w-md mx-auto w-1/2 border-solid border-2  p-16 box-shadow: 0 0 24px rgba(0, 0, 0, 0.1)">
      <div className="grid grid-cols-1 gap-6">
        <label className="block">
          <span className="text-gray-700">Recipient's wallet address</span>
          <input
            type="text"
            className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
            placeholder="0x11..A31"
            onChange={(e) => setRecipientWallet(e.target.value)}
            value={recipientWallet}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Message</span>
          <textarea
            className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
            rows={3}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="your message..."
          />
        </label>

        <label className="block">
          <div className="img__wrap flex">
            <span className="text-gray-700">Response address </span>
            <div>
              <img className="img__img" src={question} alt="question" />
              <p className="img__description">
                How recipient can get in touch with you.
              </p>
            </div>
          </div>

          <input
            type="email"
            className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
            placeholder="johndoe.example.com"
            onChange={(e) => setEmail(e.target.value)}
            id="exampleEmail0"
            value={email}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Bid amount</span>
          <input
            type="number"
            className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
            placeholder="1"
            onChange={(e) => setBidAmount(e.target.value)}
            value={bidAmount}
          />
        </label>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={sendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default SendMessage;