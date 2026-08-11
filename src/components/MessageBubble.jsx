// One message. Received: white bubble, avatar, timestamp below.
// Sent: cobalt bubble, with delivery ticks under the timestamp.

import { Check, CheckCheck } from 'lucide-react'
import Avatar from './Avatar'
import { formatTime } from '../utils/format'

export default function MessageBubble({ message, contact }) {
  if (message.fromMe) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="px-3.5 py-2 rounded-2xl rounded-br-sm bg-cobalt text-white text-sm shadow-sm">
            {message.text}
          </div>
          <p className="flex items-center justify-end gap-1 text-[10px] text-slate mt-1 mr-1">
            {formatTime(message.time)}
            <StatusTicks status={message.status} />
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <Avatar contact={contact} variant="bubble" showStatus={false} />
      <div className="max-w-[75%]">
        <div className="px-3.5 py-2 rounded-2xl rounded-bl-sm bg-surface text-sm shadow-sm">
          {message.text}
        </div>
        <p className="text-[10px] text-slate mt-1 ml-1">{formatTime(message.time)}</p>
      </div>
    </div>
  )
}

// Single check = sent, double = delivered, mint double = read
function StatusTicks({ status }) {
  if (status === 'sent') return <Check className="w-3 h-3" />
  if (status === 'delivered') return <CheckCheck className="w-3 h-3" />
  if (status === 'read') return <CheckCheck className="w-3 h-3 text-mint" />
  return null
}