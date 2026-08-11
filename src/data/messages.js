// buildContactMessages(contact, index) makes a short deterministic
// conversation that ends with the contact's "last message" preview,
// so the chat list and the thread always agree.

import { LAST_MESSAGES } from './contacts'

// Things contacts "say" in the generated threads
const RECEIVED_TEXT = [
  'Morning! How have you been?',
  'I saw your message from earlier, sorry for the delay.',
  'The meeting got moved to 3 PM, just so you know.',
  'Could you take a look at this when you have a second?',
  'I found the place, it is near the old market.',
  'Wanna grab coffee this week?',
  'That sounds like a solid plan.',
  'Okay, I will be there around noon.',
  'Have you seen the latest update?',
  'No worries at all, take your time.',
  'I attached it to the email, check your inbox.',
  'Tell me more, I am curious.',
]

// Replies "we" sent, shown in cobalt bubbles
const SENT_TEXT = [
  'Sounds great to me!',
  'Okay, let us go with that plan.',
  'I will send it right away.',
  'Good point, let me think about it.',
  'Sure, no problem at all.',
  'Nice! See you then.',
  'I will check and let you know.',
  'That works for me.',
  'Give me a few minutes.',
  'Sounds good, talk later!',
]

// Pool for the auto-reply that arrives after we send a message
export const AUTO_REPLIES = [
  'Got it, thanks!',
  'Perfect, works for me.',
  'Nice!',
  'Okay, understood.',
  'Cool, let us do that.',
  'Sure thing!',
  'Thanks for letting me know.',
  'Great, talk soon!',
]

// --- generator --------------------------------------------------------

// Deterministic random numbers, so every load shows the same threads
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Builds { id, contactId, text, time, fromMe, status } rows for one contact
export function buildContactMessages(contact, index) {
  const rnd = seededRandom(index * 7919 + 13)
  const count = 3 + Math.floor(rnd() * 4) // 3 to 6 messages
  const messages = []

  // Start 30-90 minutes before the final message, then walk forward
  let cursor = new Date(contact.timestamp.getTime() - (30 + Math.floor(rnd() * 60)) * 60000)

  for (let i = 0; i < count; i++) {
    const isFinal = i === count - 1
    const gapMinutes = 2 + Math.floor(rnd() * 20)

    if (isFinal) {
      cursor = contact.timestamp
    } else {
      cursor = new Date(cursor.getTime() + gapMinutes * 60000)
    }

    const fromMe = isFinal ? false : rnd() < 0.4 // the last message is always received
    const text = isFinal
      ? LAST_MESSAGES[index % LAST_MESSAGES.length]
      : fromMe
        ? SENT_TEXT[Math.floor(rnd() * SENT_TEXT.length)]
        : RECEIVED_TEXT[Math.floor(rnd() * RECEIVED_TEXT.length)]

    messages.push({
      id: `${contact.id}-m${i}`,
      contactId: contact.id,
      text,
      time: cursor,
      fromMe,
      // only our own messages carry a delivery status
      status: fromMe ? ['sent', 'delivered', 'read'][Math.floor(rnd() * 3)] : null,
    })
  }

  return messages
}