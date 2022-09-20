import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { getBalance } from "./utils/Contract";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import HowItWorksPage from "./components/HowItWorksPage";
import SendMessagePage from "./components/send-message/SendMessage";
import YourMessagesPage from "./components/YourMessagesPage";

import {
  PAGE_ROUTE_SEND_MESSAGE,
  PAGE_ROUTE_YOUR_MESSAGES,
} from "./constants/Routing";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletProvider, setWalletProvider] = useState(null);
  const [balance, setBalance] = useState(0);

  const getWallet = async () => {
    const ethereum = await detectEthereumProvider();
    const provider = new ethers.providers.Web3Provider(ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const address = await provider.getSigner().getAddress();
    const ensName = await provider.lookupAddress(address);
    const balanceWei = await getBalance(provider, address);
    const balanceEth = ethers.utils.formatEther(balanceWei);

    setWalletProvider(provider);
    setWalletAddress(ensName ?? address);
  };

  let selectedTab = 0;
  const location = useLocation();
  if (location.pathname.includes(PAGE_ROUTE_SEND_MESSAGE)) {
    selectedTab = 1;
  } else if (location.pathname.includes(PAGE_ROUTE_YOUR_MESSAGES)) {
    selectedTab = 2;
  }

  return (
    <div className="App">
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, textAlign: "left" }}
            >
              Ack To Earn
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
              <Button color="inherit" onClick={getWallet}>
                Connect Wallet
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <Tabs value={selectedTab} aria-label="basic tabs example">
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <Tab label="How it works" />
        </Link>
        <Link to={PAGE_ROUTE_SEND_MESSAGE} style={{ textDecoration: "none" }}>
          <Tab label="Send Message" />
        </Link>
        <Link to={PAGE_ROUTE_YOUR_MESSAGES} style={{ textDecoration: "none" }}>
          <Tab label="Your Messages" />
        </Link>
      </Tabs>
      <Routes>
        <Route path="/">
          <Route index element={<HowItWorksPage />} />
          <Route
            path={PAGE_ROUTE_SEND_MESSAGE}
            element={<SendMessagePage walletProvider={walletProvider} />}
          />
          <Route
            path={PAGE_ROUTE_YOUR_MESSAGES}
            element={
              <YourMessagesPage
                walletProvider={walletProvider}
                walletAddress={walletAddress}
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
