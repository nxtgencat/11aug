// ============================================================
// ChatHeader/index.jsx — contact avatar, name, presence text
// (online / last seen) and action buttons. The back button is
// visible only on small screens.
// ============================================================

import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react'
import Avatar from '../Avatar'
import { formatLastSeen } from '../../utils/format'

export default function ChatHeader({ contact, onBack }) {
  return (
    <header className="h-14 shrink-0 flex items-center gap-2 px-3 sm:px-4 bg-surface border-b border-line">
      {/* Back to chat list (mobile only) */}
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

      {/* Action buttons (decorative for the demo) */}
      <div className="hidden sm:flex items-center gap-2">
        <button type="button" className="btn-icon" aria-label="Call">
          <Phone className="w-4 h-4" />
        </button>
        <button type="button" className="btn-icon" aria-label="Video call">
          <Video className="w-4 h-4" />
        </button>
      </div>
      <button type="button" className="btn-icon sm:hidden" aria-label="More options">
        <MoreVertical className="w-4 h-4" />
      </button>
    </header>
  )
}