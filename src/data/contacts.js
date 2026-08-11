// ============================================================
// contacts.js — 50 dummy contacts (static mock data)
//
// Every contact is built from these lists, one per index, so
// the data is unique but the file stays short and readable.
// ============================================================

const FIRST_NAMES = [
  'Ava', 'Liam', 'Mia', 'Noah', 'Zoe', 'Ethan', 'Lily', 'Mason', 'Ivy', 'Owen',
  'Ruby', 'Caleb', 'Nora', 'Leo', 'Hazel', 'Julian', 'Isla', 'Max', 'Lucy', 'Felix',
  'Chloe', 'Adam', 'Emma', 'Lucas', 'Grace', 'Daniel', 'Leah', 'Oscar', 'Poppy', 'Henry',
  'Alice', 'Jack', 'Maya', 'Ryan', 'Ella', 'Sam', 'Vera', 'Hugo', 'Nina', 'Ivan',
  'Tess', 'Marco', 'Iris', 'Kai', 'Faye', 'Otto', 'Rosa', 'Eli', 'Juno', 'Axel',
]

const LAST_NAMES = [
  'Chen', 'Patel', 'Kim', 'Garcia', 'Nguyen', 'Novak', 'Fischer', 'Alvarez', 'Haddad', 'Moreau',
  'Tanaka', 'Ibrahim', 'Silva', 'Rossi', 'Kowalski', 'Bianchi', 'Reyes', 'Berg', 'Chowdhury', 'Vargas',
  'Lindqvist', 'Okafor', 'Duarte', 'Mercer', 'Halvorsen', 'Sato', 'Costa', 'Janssen', 'Nakamura', 'Pereira',
  'Keller', 'Delgado', 'Marchetti', 'Osei', 'Bauer', 'Fontaine', 'Malik', 'Vetter', 'Cardoso', 'Okafor',
  'Winter', 'Rinaldi', 'Huang', 'Batista', 'Lindgren', 'Moretti', 'Sokolov', 'Kaur', 'Ferreira', 'Novak',
]

// Small palette of avatar tints — matches the design system colors
const AVATAR_COLORS = ['cobalt', 'mint', 'amber', 'rose', 'ink', 'slate']

// Pool of "last message" previews shown under each contact name.
// The generated chat threads end with exactly this text (see messages.js).
const LAST_MESSAGES = [
  'Hey! Are we still on for tomorrow?',
  'The report is ready, I just emailed it.',
  'Haha, that made my day 😄',
  'Can you send the file again please?',
  'Let me check and get back to you.',
  'Perfect, thanks a lot!',
  'I left the keys on the table.',
  'Dinner was great, thanks for coming!',
  'Call me when you have a minute.',
  'I will be there in 10 minutes.',
  'Did you watch the game last night?',
  'The design looks really clean now.',
  'Sure, sounds good to me.',
  'Do you remember where we parked?',
  'How is the new job going?',
  'Check this video out when you can.',
  'Almost done, gimme 5 minutes.',
  'Happy to help anytime!',
  'What time does the flight land?',
  'The files are in the shared folder.',
]

// --- tiny helpers -----------------------------------------------------

/** Date `n` minutes ago (timestamps stay fresh relative to page load) */
function minutesAgo(n) {
  return new Date(Date.now() - n * 60000)
}

/** Date `n` days ago, pushed to a specific hour/minute */
function daysAgo(n, hour, minute) {
  const d = new Date(Date.now())
  d.setDate(d.getDate() - n)
  d.setHours(hour, minute, 0, 0)
  return d
}

/** Deterministic pseudo-random numbers (same list every load) */
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// --- build the 50 contacts -------------------------------------------

export const contacts = FIRST_NAMES.map((first, i) => {
  const rnd = seededRandom(i * 7919 + 13)
  const last = LAST_NAMES[i]
  const day = [0, 0, 1, 2, 0, 3, 0, 1, 0, 4, 0, 1, 2, 0, 3, 1, 0, 2, 0, 1][i % 20]
  const hour = 8 + Math.floor(rnd() * 12)
  const minute = Math.floor(rnd() * 60)

  return {
    id: i, // unique id (0–49)
    name: `${first} ${last}`,
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
    lastMessage: LAST_MESSAGES[i % LAST_MESSAGES.length],
    timestamp: daysAgo(day, hour, minute),
    // Presence
    online: i % 4 === 0, // every 4th contact is online
    lastSeen: i % 4 === 0 ? null : minutesAgo(3 + Math.floor(rnd() * 120)),
    // List metadata
    unread: i % 5 === 3 ? 1 + Math.floor(rnd() * 6) : 0, // some unread counts
    pinned: i % 10 === 4, // every 10th contact is pinned
    muted: i % 7 === 2, // every 7th contact is muted
  }
})

// Re-exported so both the contact list and the message generator
// derive the same "last message" text.
export { LAST_MESSAGES }