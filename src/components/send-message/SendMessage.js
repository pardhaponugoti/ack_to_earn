import React, { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

import CircularProgress from '@mui/material/CircularProgress'

import { Dialog } from '@headlessui/react'

import './SendMessage.css'
import question from '../../images/question.png'
import { sendMessage } from '../../utils/Contract'
import { getStorageClient } from '../../utils/FileStorage'

function SendMessage(props) {
  const { walletProvider, transactionCount, setTransactionCount } = props
  const [recipientWallet, setRecipientWallet] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [attachedFile, setAttachedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const queryParams = useLocation().search
  // eslint-disable-next-line no-unused-vars
  const [_, setSearchParams] = useSearchParams()

  const storageClient = getStorageClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (queryParams) {
      const specifiedAddress = new URLSearchParams(queryParams).get('to')
      setSearchParams({})
      setRecipientWallet(specifiedAddress)
    }
  }, [queryParams, setSearchParams])

  const send = async (e) => {
    let fileCid = ''

    e.preventDefault()
    if (attachedFile) {
      const fileInput = document.querySelector('input[type="file"]')
      const rootCid = await storageClient.put(fileInput.files)
      const info = await storageClient.status(rootCid)
      fileCid = info.cid
    }

    setIsLoading(true)

    const resolvedAddress = await getResolvedEnsAddress()
    const recipientWalletAddress = resolvedAddress ?? recipientWallet
    const sendMessageResult = await sendMessage(
      walletProvider,
      message,
      recipientWalletAddress,
      email,
      fileCid,
      bidAmount,
    )

    if (sendMessageResult && sendMessageResult.status === 1) {
      setRecipientWallet('')
      setMessage('')
      setEmail('')
      setBidAmount('')
      setAttachedFile(null)

      // TODO: add success state
    } else {
      // TODO: set error state with descriptive error message
    }

    setTransactionCount(transactionCount + 1)
    setIsLoading(false)
  }

  const getResolvedEnsAddress = async () => {
    const ethereum = await detectEthereumProvider()
    const provider = new ethers.providers.Web3Provider(ethereum, 'any')

    return await provider.resolveName(recipientWallet)
  }

  function MyDialog(props) {
    let [isOpen, setIsOpen] = useState(props.isOpen)

    return (
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed z-40 inset-0"
      >
        <Dialog.Panel className="bg-slate-100 p-8 mx-auto max-w-sm border rounded-lg shadow-sm my-96">
          <Dialog.Title className="text-lg font-semibold">
            What's a response address?
          </Dialog.Title>
          <Dialog.Description>
            Add an email address so that you're recipient can contact you
            outside of Ack to Earn.
          </Dialog.Description>
          <div className="flex">
            <button
              className="mt-4 font-semibold rounded-xl text-sm uppercase inline-block px-4 py-1 text-violet-700 hover:bg-slate-100"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    )
  }

  if (!walletProvider) {
    return (
      <div className="text-center text-2xl">Please connect your wallet</div>
    )
  }

  return (
    <div className=" h-screen pt-4">
      <div className="mt-8 max-w-lg mx-auto w-3/4 border-solid border rounded-lg p-16 bg-white">
        {isLoading && (
          <div className="text-center absolute top-[50%] right-[49%]">
            <CircularProgress />
          </div>
        )}
        <div className="grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-slate-800">Recipient's wallet address</span>
            <input
              type="text"
              className="shadow-sm bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-violet-500 focus:outline-violet-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-violet-500 dark:focus:outline-violet-500 dark:shadow-sm-light"
              placeholder="0x11..A31"
              onChange={(e) => setRecipientWallet(e.target.value)}
              value={recipientWallet}
              disabled={isLoading}
            />
          </label>
          <label className="block">
            <span className="text-slate-800">Message</span>
            <textarea
              className="shadow-sm bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-violet-500 focus:outline-violet-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-violet-500 dark:focus:outline-violet-500 dark:shadow-sm-light"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              disabled={isLoading}
              placeholder="Your message..."
            />
          </label>

          <label className="block">
            <div className="flex justify-between">
              <span className="text-slate-800">Response address</span>
              <span
                className="italic text-slate-500 text-bold cursor-pointer "
                onClick={() => setIsDialogOpen(!isDialogOpen)}
              >
                what is this?
              </span>
              <MyDialog isOpen={isDialogOpen}></MyDialog>
            </div>

            <input
              type="email"
              className="shadow-sm bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-violet-500 focus:outline-violet-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-violet-500 dark:focus:outline-violet-500 dark:shadow-sm-light"
              placeholder="johndoe@example.com"
              onChange={(e) => setEmail(e.target.value)}
              id="exampleEmail0"
              value={email}
              disabled={isLoading}
            />
          </label>

          <label className="block">
            <span className="text-slate-800">Bid amount (ETH)</span>
            <input
              type="number"
              className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
              placeholder="1"
              onChange={(e) => setBidAmount(e.target.value)}
              value={bidAmount}
              disabled={isLoading}
            />
          </label>

          <label className="block">
            <span className="text-slate-800">Attach a file (optional)</span>
            <input
              type="file"
              className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-ligh"
              onChange={(e) => {
                setAttachedFile(e.target.files[0])
              }}
              disabled={isLoading}
            />
          </label>

          <button
            type="submit"
            className="font-medium rounded-xl drop-shadow-md uppercase mt-8 inline-block px-8 py-2 bg-violet-700 text-gray-100"
            onClick={send}
            disabled={isLoading}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default SendMessage
