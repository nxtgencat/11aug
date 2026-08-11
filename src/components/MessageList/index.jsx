// Scrollable thread with day separators; keeps the newest message
// in view.

import { useEffect, useRef } from 'react'
import MessageBubble from '../MessageBubble'
import { formatDayLabel } from '../../utils/format'

export default function MessageList({ contact, messages }) {
  // Keep the newest message visible when the chat opens or messages change
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, contact.id])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {messages.map((message, i) => {
          // insert a day divider when the day changes between rows
          const showDay =
            i === 0 || !sameDay(messages[i - 1].time, message.time)

          return (
            <div key={message.id}>
              {showDay && <DayMarker date={message.time} />}
              <div className={i === 0 ? '' : 'mt-3'}>
                <MessageBubble message={message} contact={contact} />
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// Dashed line + mono label, matching the design system's separator
function DayMarker({ date }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px flex-1 bg-line" />
      <span className="font-mono text-[10px] tracking-widest text-slate/70 uppercase">
        {formatDayLabel(date)}
      </span>
      <div className="h-px flex-1 bg-line" />
    </div>
  )
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}