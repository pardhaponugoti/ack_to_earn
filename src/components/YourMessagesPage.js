import { useState, useEffect } from 'react'
import { getMessages } from '../utils/Contract'
import SideBar from './SideBar'
import MessageList from './MessageList'
import SelectedMessage from './SelectedMessage'
import Filters from './Filters'

const YourMessagesPage = (props) => {
  const {
    walletProvider,
    walletAddress,
    transactionCount,
    setTransactionCount,
  } = props
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [allMessages, setAllMessages] = useState([])
  const [messageType, setMessageType] = useState('Inbox')
  const [filterCategory, setFilterCategory] = useState('All')

  const isMessageExpired = (message) => {
    let timeStamp = message.timestamp.toString()
    timeStamp = timeStamp * 1000 //converts it to milliseconds
    let deadlineDay = new Date(timeStamp)
    deadlineDay.setHours(deadlineDay.getHours() + 168) // add 7 days
    const date1 = new Date(deadlineDay)
    const date2 = new Date()
    const remainder = (date1 - date2) / 1000 / 60 / 60 / 24
    return remainder < 0
  }

  const setFilterCategoryAndResetMessage = (filterCategory) => {
    setFilterCategory(filterCategory)
    setSelectedMessage(null)
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(walletProvider)
      const yourMessages = messages
        .filter((message) => {
          return (
            message.bidder === walletAddress ||
            message.recipient === walletAddress
          )
        })
        .map((message) => {
          return {
            expired: isMessageExpired(message),
            ...message,
          }
        })
        .sort((message1, message2) => {
          return message2.timestamp - message1.timestamp
        })

      setAllMessages(yourMessages)
    }

    if (walletProvider) {
      fetchMessages()
    }
  }, [walletProvider, walletAddress, transactionCount])

  if (!walletProvider) {
    return (
      <div className="text-slate-900 py-12 text-center text-2xl">
        Please connect your wallet
      </div>
    )
  }

  let filteredMessages = allMessages

  // Filter by message type
  if (messageType === 'Inbox') {
    filteredMessages = filteredMessages.filter(
      (message) => message.recipient === walletAddress,
    )
  }
  if (messageType === 'Sent') {
    filteredMessages = filteredMessages.filter(
      (message) => message.bidder === walletAddress,
    )
  }

  // Filter by category
  if (filterCategory === 'Active') {
    filteredMessages = filteredMessages.filter(
      (message) => !message.expired && !message.claimed,
    )
  }
  if (filterCategory === 'Expired') {
    filteredMessages = filteredMessages.filter(
      (message) => message.expired && !message.claimed,
    )
  }
  if (filterCategory === 'Claimed') {
    filteredMessages = filteredMessages.filter((message) => message.claimed)
  }

  return (
    <div className="divide-y divide-gray-200">
      <div className="px-8 py-4 flex items-center justify-between bg-white">
        <Filters
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategoryAndResetMessage}
        />
      </div>
      <div className="grid grid-cols-7 p-4 gap-4">
        <div className="col-span-1">
          <SideBar setMessageType={setMessageType} messageType={messageType} />
        </div>
        <div className="col-span-2">
          <MessageList
            data={filteredMessages}
            setSelectedMessage={setSelectedMessage}
            selectedMessage={selectedMessage}
          />
        </div>
        <div className="col-span-4">
          <SelectedMessage
            selectedMessage={selectedMessage}
            walletProvider={walletProvider}
            walletAddress={walletAddress}
            transactionCount={transactionCount}
            setTransactionCount={setTransactionCount}
          />
        </div>
      </div>
    </div>
  )
}

export default YourMessagesPage
