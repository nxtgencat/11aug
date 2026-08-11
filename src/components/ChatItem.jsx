// One chat-list row: avatar with online dot, name, last-message
// preview, timestamp, unread badge, and pin/mute indicators.

import { Pin, VolumeX } from 'lucide-react'
import Avatar from './Avatar'
import { formatListTime } from '../utils/format'

export default function ChatItem({ contact, active, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer ${
          active ? 'bg-cobalt/10' : 'hover:bg-ink/5'
        }`}
      >
        <Avatar contact={contact} variant="list" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium truncate">{contact.name}</span>

            {/* pinned chat */}
            {contact.pinned && (
              <Pin className="w-3 h-3 text-slate shrink-0" aria-label="Pinned chat" />
            )}

            {/* muted chat */}
            {contact.muted && (
              <VolumeX className="w-3 h-3 text-slate shrink-0" aria-label="Muted chat" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <p
              className={`text-xs truncate mt-0.5 ${
                contact.unread > 0 ? 'text-ink font-medium' : 'text-slate'
              }`}
            >
              {contact.lastMessage}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[11px] text-slate">{formatListTime(contact.timestamp)}</span>
          {contact.unread > 0 && (
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-cobalt text-white text-[10px] font-semibold grid place-content-center">
              {contact.unread}
            </span>
          )}
        </div>
      </button>
    </li>
  )
}