// ============================================================
// format.js — small date/time helpers used across the app
// ============================================================

/** "9:41 AM" — short clock time */
export function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

/** "9:41 AM" / "Yesterday" / "Monday" / "Dec 5" — used in the chat list */
export function formatListTime(date) {
  const diffDays = daysBetween(date, new Date())
  if (diffDays === 0) return formatTime(date)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'long' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/** "Today" / "Yesterday" / "Monday, Dec 5" — day markers inside a chat */
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

/** Whole days between two dates (ignores clock time) */
function daysBetween(from, to) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b - a) / 86400000)
}