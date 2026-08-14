// Contact avatar, name, online/last-seen text, and action buttons.
// The back button only shows on small screens. The options menu
// holds the programmatic mute and pin toggles.

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, MoreVertical, Phone, Pin, PinOff, Video, Volume2, VolumeX } from 'lucide-react'
import Avatar from './Avatar'
import { formatLastSeen } from '../utils/format'

export default function ChatHeader({ contact, onBack, muted, pinned, onToggleMute, onTogglePin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close the menu when clicking anywhere else
  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="h-14 shrink-0 flex items-center gap-2 px-3 sm:px-4 bg-surface border-b border-line">
      {/* back to chat list, mobile only */}
      <button type="button" onClick={onBack} className="btn-icon lg:hidden" aria-label="Back to chats">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <Avatar contact={contact} variant="header" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{contact.name}</p>
        <p className={`text-xs truncate ${contact.online ? 'text-mint' : 'text-slate'}`}>
          {formatLastSeen(contact)}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <button type="button" className="btn-icon" aria-label="Call">
          <Phone className="w-4 h-4" />
        </button>
        <button type="button" className="btn-icon" aria-label="Video call">
          <Video className="w-4 h-4" />
        </button>
      </div>

      {/* options menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`btn-icon ${menuOpen ? 'bg-ink text-paper border-ink' : ''}`}
          aria-label="Chat options"
          aria-expanded={menuOpen}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface border border-line shadow-md overflow-hidden z-20">
            <p className="px-3 pt-2.5 pb-1 font-mono text-[10px] tracking-widest text-slate/70 uppercase">
              Options
            </p>
            <button
              type="button"
              onClick={() => {
                onToggleMute()
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-ink/5 transition-colors cursor-pointer"
            >
              {muted ? (
                <Volume2 className="w-4 h-4 text-cobalt shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate shrink-0" />
              )}
              {muted ? 'Unmute notifications' : 'Mute notifications'}
            </button>
            <button
              type="button"
              onClick={() => {
                onTogglePin()
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-ink/5 transition-colors cursor-pointer"
            >
              {pinned ? (
                <PinOff className="w-4 h-4 text-cobalt shrink-0" />
              ) : (
                <Pin className="w-4 h-4 text-slate shrink-0" />
              )}
              {pinned ? 'Unpin chat' : 'Pin chat'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}