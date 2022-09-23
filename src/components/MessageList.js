import React from 'react'
import Moment from 'react-moment'
import { formatEther } from 'ethers/lib/utils'

function MessageList(props) {
  const { data, setSelectedMessage, selectedMessage } = props

  return (
    <div className="space-y-4">
      {data ? (
        data.map((message, index) => (
          <div
            key={index}
            onClick={() => setSelectedMessage(message)}
            className={`px-4 py-4 rounded-lg border ${
              selectedMessage && message.id === selectedMessage.id
                ? `border-slate-200 bg-white shadow-sm`
                : `border-slate-200 hover:border-slate-200 cursor-pointer`
            }`}
          >
            <div className="flex items-center justify-between space-x-12">
              <div className="flex-grow truncate">{message.bidder}</div>
              <div className="flex-shrink-0 whitespace-nowrap text-slate-400">
                <Moment fromNow>{message.timestamp}</Moment>
              </div>
            </div>
            <div className="py-4">{message.message}</div>
            <div className="text-sm text-slate-400 pb-1">
              Acknowledge to earn
            </div>
            <div className="flex items-center justify-between text-sm px-3 py-2 border border-slate-200 rounded">
              <div className="font-bold">
                {formatEther(message.recipientAmount)} ETH
              </div>
              <div>
                {message.claimed ? (
                  <div className="px-2 py-0.5 bg-green-100 text-green-600 rounded">
                    Claimed
                  </div>
                ) : (
                  <div className="text-red-400">
                    Expires in{' '}
                    <Moment add={{ day: 7 }} fromNow ago>
                      {message.timestamp}
                    </Moment>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">No messages yet...</div>
      )}
    </div>
  )
}

export default MessageList
