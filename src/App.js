import React, { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider'

import SendMessagePage from './components/SendMessagePage';
import YourMessagesPage from './components/YourMessagesPage';
import { 
  PAGE_ROUTE_SEND_MESSAGE, 
  PAGE_ROUTE_YOUR_MESSAGES 
} from "./constants/Routing";
import './App.css';

function App() {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const getWallet = async () => {
      const ethereum = await detectEthereumProvider();
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const address = await provider.getSigner().getAddress();
      setAddress(address);
    };

    getWallet();
  });

  let selectedTab = 0;
  const location = useLocation();
  if (location.pathname.includes(PAGE_ROUTE_SEND_MESSAGE)) {
    selectedTab = 1;
  } else if ((location.pathname.includes(PAGE_ROUTE_YOUR_MESSAGES))) {
    selectedTab = 2;  
  }

  return (
    <div className="App">
      <div>
        {address ? (
          <p>
            <strong>Wallet address:</strong> {address}
          </p>
        ) : (
          <p>Fetching wallet..</p>
        )}
      </div>
      <Tabs value={selectedTab} aria-label="basic tabs example">
        <Link to={"/"} style={{textDecoration: "none"}}>
          <Tab label="How it works" />
        </Link>
        <Link to={PAGE_ROUTE_SEND_MESSAGE} style={{textDecoration: "none"}}>
          <Tab label="Send Message" />
        </Link>
        <Link to={PAGE_ROUTE_YOUR_MESSAGES} style={{textDecoration: "none"}}>
          <Tab label="Your Messages" />
        </Link>
      </Tabs>
      <Routes>
        <Route path="/">
          <Route index element={<div>Welcome to AckToEarn!</div>} />
          <Route path={PAGE_ROUTE_SEND_MESSAGE} element={<SendMessagePage />} />
          <Route path={PAGE_ROUTE_YOUR_MESSAGES} element={<YourMessagesPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
