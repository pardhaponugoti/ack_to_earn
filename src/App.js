import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

import AppBar from '@mui/material/AppBar'
import { Tab } from '@headlessui/react'
//import Tabs from "@mui/material/Tabs";
//import Tab from "@mui/material/Tab";
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import HowItWorksPage from './components/HowItWorksPage'
import SendMessagePage from './components/send-message/SendMessage'
import YourMessagesPage from './components/YourMessagesPage'
import Balance from './components/Balance'

import {
  PAGE_ROUTE_SEND_MESSAGE,
  PAGE_ROUTE_YOUR_MESSAGES,
  PAGE_ROUTE_BALANCE,
} from './constants/Routing'
import './App.css'

function App() {
  const [walletAddress, setWalletAddress] = useState(null)
  const [walletProvider, setWalletProvider] = useState(null)
  const [transactionCount, setTransactionCount] = useState(0)

  const getWallet = async () => {
    const ethereum = await detectEthereumProvider()
    const provider = new ethers.providers.Web3Provider(ethereum, 'any')
    await provider.send('eth_requestAccounts', [])
    const address = await provider.getSigner().getAddress()
    const ensName = await provider.lookupAddress(address)

    setWalletProvider(provider)
    setWalletAddress(ensName ?? address)
  }

  let selectedTab = 0
  const location = useLocation()
  if (location.pathname.includes(PAGE_ROUTE_SEND_MESSAGE)) {
    selectedTab = 1
  } else if (location.pathname.includes(PAGE_ROUTE_YOUR_MESSAGES)) {
    selectedTab = 2
  } else if (location.pathname.includes(PAGE_ROUTE_BALANCE)) {
    selectedTab = 3
  }

  function NavBarLink(props) {
    return (
      <div
        className={`px-3 py-2 border rounded-xl border-slate-100 ${
          props.active ? `bg-slate-100` : `hover:bg-slate-100`
        }`}
      >
        {props.title}
      </div>
    )
  }

  return (
    <div className="mt-16">
      <div className="fixed top-0 inset-x-0 h-16 flex items-center justify-between px-8 bg-white">
        <div className="flex items-center space-x-4">
          <div className="text-lg">
            ACK TO <span className="font-bold">EARN</span>
          </div>
          <div className="text-md flex items-center justify-center space-x-2">
            <Link to={PAGE_ROUTE_YOUR_MESSAGES}>
              <NavBarLink title="Your Messages" active={selectedTab == 2} />
            </Link>
            <Link to={PAGE_ROUTE_SEND_MESSAGE}>
              <NavBarLink title="Send Message" active={selectedTab == 1} />
            </Link>
            <Link to={'/'}>
              <NavBarLink title="How it Works" active={selectedTab == 0} />
            </Link>
          </div>
        </div>
        <div>
          {walletAddress ? (
            <div className="flex items-center space-x-4">
              <Link to={PAGE_ROUTE_BALANCE}>
                <NavBarLink title="Your Balance" active={selectedTab == 3} />
              </Link>
              <div className="w-24 truncate">{walletAddress}</div>
            </div>
          ) : (
            <button
              onClick={getWallet}
              className="font-semibold rounded-xl text-sm border-slate-100 border-2 uppercase inline-block px-6 py-2 text-violet-700 hover:bg-slate-100"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
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
  )
}

export default App
