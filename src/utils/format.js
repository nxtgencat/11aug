// Date formatting helpers for the chat list and message bubbles.

/** "9:41 AM" */
export function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

/** "9:41 AM" / "Yesterday" / "Monday" / "Dec 5", used in the chat list */
export function formatListTime(date) {
  const diffDays = daysBetween(date, new Date())
  if (diffDays === 0) return formatTime(date)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'long' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/** "Today" / "Yesterday" / "Monday, Dec 5", for day markers in a thread */
export function formatDayLabel(date) {
  const diffDays = daysBetween(date, new Date())
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
}

/** "online" / "last seen today at 9:41 AM" / "last seen yesterday" */
export function formatLastSeen(contact) {
  if (contact.online) return 'online'
  if (!contact.lastSeen) return 'offline'
  const diffDays = daysBetween(contact.lastSeen, new Date())
  if (diffDays === 0) return `last seen today at ${formatTime(contact.lastSeen)}`
  if (diffDays === 1) return 'last seen yesterday'
  return `last seen ${formatDayLabel(contact.lastSeen)}`
}

/** Whole days between two dates, ignoring clock time */
function daysBetween(from, to) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b - a) / 86400000)
}

/** "0:07" / "1:24", used for voice message lengths */
export function formatDuration(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** True when the text is just emoji (rendered larger, like WhatsApp) */
export function isEmojiOnly(text) {
  const compact = text.replace(/\s/g, '')
  if (!compact || compact.length > 8) return false
  return [...compact].every((ch) => {
    // ZWJ joins emoji (family), variation/keycap marks attach to one
    if (ch === '\u200D' || ch === '\uFE0F' || ch === '\u20E3') return true
    return /^[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}#*0-9]$/u.test(ch)
  })
}

/** "128 KB" / "2.4 MB", used in document attachments */
export function formatBytes(bytes) {
  if (!bytes) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}