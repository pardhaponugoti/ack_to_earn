import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import AppBar from "@mui/material/AppBar";
import { Tab } from "@headlessui/react";
//import Tabs from "@mui/material/Tabs";
//import Tab from "@mui/material/Tab";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import HowItWorksPage from "./components/HowItWorksPage";
import SendMessagePage from "./components/send-message/SendMessage";
import YourMessagesPage from "./components/YourMessagesPage";
import Balance from "./components/Balance";

import {
  PAGE_ROUTE_SEND_MESSAGE,
  PAGE_ROUTE_YOUR_MESSAGES,
  PAGE_ROUTE_BALANCE,
} from "./constants/Routing";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletProvider, setWalletProvider] = useState(null);
  const [transactionCount, setTransactionCount] = useState(0);

  const getWallet = async () => {
    const ethereum = await detectEthereumProvider();
    const provider = new ethers.providers.Web3Provider(ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const address = await provider.getSigner().getAddress();
    const ensName = await provider.lookupAddress(address);

    setWalletProvider(provider);
    setWalletAddress(ensName ?? address);
  };

  let selectedTab = 0;
  const location = useLocation();
  if (location.pathname.includes(PAGE_ROUTE_SEND_MESSAGE)) {
    selectedTab = 1;
  } else if (location.pathname.includes(PAGE_ROUTE_YOUR_MESSAGES)) {
    selectedTab = 2;
  } else if (location.pathname.includes(PAGE_ROUTE_BALANCE)) {
    selectedTab = 3;
  }

  return (
    <div className="App">
      <div>
        <AppBar position="static">
          <Toolbar className="bg-white text-gray-900">
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, textAlign: "left" }}
            >
              ACK TO <strong>EARN</strong>
            </Typography>
            {walletAddress ? (
              <Typography
                variant="p"
                component="div"
                sx={{ flexGrow: 1, textAlign: "right" }}
              >
                {walletAddress}
              </Typography>
            ) : (
              <div
                onClick={getWallet}
                className="font-semibold rounded-xl text-sm border-slate-100 border-2 uppercase inline-block px-6 py-2 text-violet-700 hover:bg-slate-100"
              >
                <h4>Connect Wallet</h4>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <Tab.Group className="text-md flex justify-center mt-7">
        <Tab.List>
          <Tab
            className="px-4 py-3 border-2 rounded-xl border-slate-100 mx-2 hover:bg-slate-100"
            Link
            to={"/"}
          >
            How it works
          </Tab>
          <Tab
            className="px-4 py-3 border-2 rounded-xl border-slate-100 mx-2  hover:bg-slate-100"
            Link
            to={PAGE_ROUTE_SEND_MESSAGE}
          >
            Send Message
          </Tab>
          <Tab
            className="px-4 py-3 border-2 rounded-xl border-slate-100 mx-2  hover:bg-slate-100"
            Link
            to={PAGE_ROUTE_YOUR_MESSAGES}
          >
            Your Messages
          </Tab>
          <Tab
            className="px-4 py-3 border-2 rounded-xl border-slate-100 mx-2  hover:bg-slate-100"
            Link
            to={PAGE_ROUTE_BALANCE}
          >
            Your Balance
          </Tab>
        </Tab.List>
      </Tab.Group>
      {/*<Tabs value={selectedTab} aria-label="basic tabs example">
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <Tab label="How it works" />
        </Link>
        <Link to={PAGE_ROUTE_SEND_MESSAGE} style={{ textDecoration: "none" }}>
          <Tab label="Send Message" />
        </Link>
        <Link to={PAGE_ROUTE_YOUR_MESSAGES} style={{ textDecoration: "none" }}>
          <Tab label="Your Messages" />
        </Link>
        <Link to={PAGE_ROUTE_BALANCE} style={{ textDecoration: "none" }}>
          <Tab label="Your Balance" />
        </Link>
            </Tabs>*/}
      <Routes>
        <Route path="/">
          <Route index element={<HowItWorksPage />} />
          <Route
            path={PAGE_ROUTE_SEND_MESSAGE}
            element={
              <SendMessagePage
                walletProvider={walletProvider}
                transactionCount={transactionCount}
                setTransactionCount={setTransactionCount}
              />
            }
          />
          <Route
            path={PAGE_ROUTE_YOUR_MESSAGES}
            element={
              <YourMessagesPage
                walletProvider={walletProvider}
                walletAddress={walletAddress}
                transactionCount={transactionCount}
                setTransactionCount={setTransactionCount}
              />
            }
          />
          <Route
            path={PAGE_ROUTE_BALANCE}
            element={
              <Balance
                walletProvider={walletProvider}
                walletAddress={walletAddress}
                transactionCount={transactionCount}
                setTransactionCount={setTransactionCount}
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
