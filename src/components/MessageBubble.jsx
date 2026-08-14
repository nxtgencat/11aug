// One message. Received: white bubble, avatar, timestamp below.
// Sent: cobalt bubble, with delivery ticks under the timestamp.
// Handles text, attachments (image / video / document / contact),
// and voice messages.

import { Check, CheckCheck, FileText } from 'lucide-react'
import Avatar from './Avatar'
import VoiceNote from './VoiceNote'
import { formatBytes, formatTime, isEmojiOnly } from '../utils/format'

export default function MessageBubble({ message, contact }) {
  const emojiOnly = isEmojiOnly(message.text)

  const bubbleClass = emojiOnly
    ? 'px-2.5 py-1.5 text-4xl leading-none'
    : 'px-3.5 py-2 text-sm'

  if (message.fromMe) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div
            className={`${bubbleClass} rounded-2xl rounded-br-sm bg-cobalt text-white shadow-sm`}
          >
            <MessageContent message={message} sent />
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
        <div
          className={`${bubbleClass} rounded-2xl rounded-bl-sm bg-surface shadow-sm`}
        >
          <MessageContent message={message} />
        </div>
        <p className="text-[10px] text-slate mt-1 ml-1">{formatTime(message.time)}</p>
      </div>
    </div>
  )
}

// Text, attachments, and voice notes in their natural order
function MessageContent({ message, sent }) {
  const images = (message.media || []).filter(
    (m) => m.kind === 'image' || m.kind === 'video',
  )
  const others = (message.media || []).filter(
    (m) => m.kind === 'document' || m.kind === 'contact',
  )

  return (
    <div className="space-y-1.5">
      {images.length > 0 && (
        <div
          className={
            images.length === 1
              ? ''
              : 'grid grid-cols-2 gap-1'
          }
        >
          {images.map((m) =>
            m.kind === 'video' ? (
              <video
                key={m.id}
                src={m.url}
                controls
                className="rounded-lg w-full max-h-64 object-cover bg-ink/10"
              />
            ) : (
              <img
                key={m.id}
                src={m.url}
                alt={m.name}
                className="rounded-lg w-full max-h-64 object-cover"
              />
            ),
          )}
        </div>
      )}

      {others.map((m) => (
        <AttachmentCard key={m.id} item={m} sent={sent} />
      ))}

      {message.voice && (
        <VoiceNote voice={message.voice} variant={sent ? 'sent' : 'received'} />
      )}

      {message.text && <p>{message.text}</p>}
    </div>
  )
}

// Document or contact card inside the bubble
function AttachmentCard({ item, sent }) {
  if (item.kind === 'document') {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
          sent ? 'border-white/30' : 'border-line'
        }`}
      >
        <span className={`w-9 h-9 rounded-lg grid place-content-center ${sent ? 'bg-white/20' : 'bg-amber/10 text-amber'}`}>
          <FileText className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{item.name}</p>
          <p className={`text-xs ${sent ? 'text-white/70' : 'text-slate'}`}>
            {formatBytes(item.size)}
          </p>
        </div>
      </div>
    )
  }

  // contact card
  const initials = item.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 min-w-52 ${
        sent ? 'border-white/30' : 'border-line'
      }`}
    >
      <span
        className={`w-10 h-10 rounded-full grid place-content-center font-semibold text-sm ${
          sent ? 'bg-white/20 text-white' : 'bg-cobalt/10 text-cobalt'
        }`}
      >
        {initials}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className={`text-xs truncate ${sent ? 'text-white/70' : 'text-slate'}`}>
          {item.phone}
        </p>
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