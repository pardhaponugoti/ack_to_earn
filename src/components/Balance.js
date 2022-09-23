import { useEffect, useState } from 'react'
import { getBalance, withdrawFunds } from '../utils/Contract'
import { Button, Card, Container } from '@mui/material'
function Balance(props) {
  const {
    walletProvider,
    walletAddress,
    receivedMessagesBalance,
    sentMessagesBalance,
    transactionCount,
    setTransactionCount,
  } = props
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const getMyBalance = async () => {
      const balance = await getBalance(walletProvider, walletAddress)
      setBalance(balance)
    }

    getMyBalance()
  }, [walletProvider, walletAddress, transactionCount])

  const sendToWallet = async () => {
    await withdrawFunds(walletProvider, balance)
    setTransactionCount(transactionCount + 1)
  }

  return (
    <div className="h-screen">
      <div className="px-6 py-6 mt-12 bg-white flex mx-auto max-w-lg border-1 border-slate-100 justify-center">
        <div className="p-6 ">
          <p className="font-bold text-lg py-1">Balances</p>
          <div className="flex py-1">
            <p className="basis-1/2">
              In received messages:
              <span className="font-medium">
                {' '}
                {receivedMessagesBalance} Eth
              </span>
            </p>
            <p className="basis-1/2">
              Available to claim:
              <span className="font-medium"> {balance} Eth</span>
            </p>
          </div>
          <div className="flex py-1">
            <p className="basis-1/2">
              In sent messages:{' '}
              <span className="font-medium"> {sentMessagesBalance} Eth</span>
            </p>
            <button
              className="font-semibold rounded-xl drop-shadow-md uppercase inline-block px-8 py-2 bg-violet-700 text-gray-100 text-bold"
              onClick={sendToWallet}
              disabled={balance <= 0 ? true : false}
            >
              Send to wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance
