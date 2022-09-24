import React, { useEffect, useState } from 'react'
import { claimBalance } from '../utils/Contract'
import { Typography } from '@mui/material'
import Moment from 'react-moment'
import { EmailOutlined } from '@mui/icons-material'
import { formatEther } from 'ethers/lib/utils'

function SelectedMessage(props) {
  const {
    walletProvider,
    selectedMessage,
    transactionCount,
    setTransactionCount,
  } = props
  const [deadline, setDeadline] = useState('1')

  useEffect(() => {
    const getDays = () => {
      let timeStamp = selectedMessage?.timestamp.toString()
      // converts it to milliseconds
      timeStamp = timeStamp * 1000
      // convert it to day, then add 7 days
      let deadlineDay = new Date(timeStamp)
      deadlineDay.setHours(deadlineDay.getHours() + 168)

      const date1 = new Date(deadlineDay)
      const date2 = new Date()
      const reminder = Math.floor((date1 - date2) / 1000 / 60 / 60 / 24)
      setDeadline(reminder)
    }

    if (selectedMessage) {
      getDays()
    }
    // eslint-disable-next-line no-use-before-define
  }, [selectedMessage])

  const claimMessageBalance = async (message) => {
    await claimBalance(walletProvider, message.id.toNumber())
    setTransactionCount(transactionCount + 1)
  }

  return (
    <div className="">
      {selectedMessage ? (
        <div className="p-8 bg-white border border-slate-200 rounded-lg space-y-4 divide-y divide-gray-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div>
                <b>From: </b>
                {selectedMessage.bidder}
              </div>
              <div>
                <b>Date: </b>
                <Moment format="MMM DD, YYYY">
                  {selectedMessage.timestamp}
                </Moment>
              </div>
              <div>
                <b>Value: </b>
                {formatEther(selectedMessage.recipientAmount)} ETH
              </div>
              <div>
                <b>Expires: </b>
                {deadline} days
              </div>
              <div>
                <b>Reply to: </b>
                {selectedMessage.responseEmailAddress}
              </div>
            </div>
          </div>
          <div className="py-8 space-y-6">
            <div>{selectedMessage.message}</div>
            <div>
              {selectedMessage.fileCid && (
                <React.Fragment>
                  <Typography noWrap variant="body2" color="text.secondary">
                    File:{' '}
                    <a
                      target="_blank"
                      href={`https://dweb.link/ipfs/${selectedMessage.fileCid}`}
                      rel="noreferrer"
                      className="text-blue-700 underline"
                    >
                      Link
                    </a>
                  </Typography>
                  <br />
                </React.Fragment>
              )}
              {!selectedMessage.claimed && !selectedMessage.expired && (
                <button
                  className="text-violet-700 border-slate-200 px-2 py-1 rounded-lg border"
                  onClick={() => claimMessageBalance(selectedMessage)}
                >
                  Acknowledge this message
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 w-full text-center space-y-4">
          <div>
            <EmailOutlined />
          </div>
          <div>Please select a message</div>
        </div>
      )}
    </div>
  )
}

export default SelectedMessage
