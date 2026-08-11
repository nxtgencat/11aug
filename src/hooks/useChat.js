// ============================================================
// useChat.js — data layer for the chat screens
//
// Holds all chat state: the contact list, the chat threads,
// which chat is open, and the search query. Components only
// read from this hook and call its actions.
// ============================================================

import { useMemo, useState } from 'react'
import { contacts as seedContacts } from '../data/contacts'
import { buildContactMessages, AUTO_REPLIES } from '../data/messages'

export function useChat() {
  // Contacts live in state so the UI can update them:
  // opening a chat clears its unread count, sending a message
  // changes its preview text and bumps it to the top of the list.
  const [contacts, setContacts] = useState(seedContacts)

  // Chat threads: { contactId: [messages...] }, built on demand
  const [threads, setThreads] = useState({})

  const [selectedContactId, setSelectedContactId] = useState(null)
  const [search, setSearch] = useState('')

  // --- derived values ------------------------------------------------

  // Contacts we actually have a thread for (fall back to generated data)
  const selectedContact = contacts.find((c) => c.id === selectedContactId) || null

  const selectedMessages = useMemo(() => {
    if (selectedContactId === null) return []
    return (
      threads[selectedContactId] ??
      buildContactMessages(selectedContact, selectedContactId)
    )
  }, [threads, selectedContactId, selectedContact])

  // Sorted list: pinned contacts first, then most recent first
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.timestamp - a.timestamp
    })
  }, [contacts])

  // Search filter, matched against the contact name
  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sortedContacts
    return sortedContacts.filter((c) => c.name.toLowerCase().includes(q))
  }, [sortedContacts, search])

  // --- actions ---------------------------------------------------------

  /** Open a chat: clear unread + hide the list on mobile */
  function selectContact(id) {
    setSelectedContactId(id)
    setContacts((prev) =>
      prev.map((c) => (c.id === id && c.unread > 0 ? { ...c, unread: 0 } : c)),
    )
  }

  /** Go back to the chat list (mobile back button) */
  function clearSelected() {
    setSelectedContactId(null)
  }

  /**
   * Send a message, then pretend the other person read it and replies.
   * The timeouts just simulate network delay for the demo.
   */
  function sendMessage(text) {
    if (!selectedContact || !text.trim()) return

    const sent = {
      id: `me-${Date.now()}`,
      contactId: selectedContact.id,
      text: text.trim(),
      time: new Date(),
      fromMe: true,
      status: 'sent', // sent → delivered → read
    }

    // Append to the thread (create one if this chat has none yet)
    setThreads((prev) => ({
      ...prev,
      [selectedContact.id]: [
        ...(prev[selectedContact.id] ?? buildContactMessages(selectedContact, selectedContact.id)),
        sent,
      ],
    }))

    // Slide the contact to the top of the list
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id ? { ...c, lastMessage: sent.text, timestamp: sent.time, unread: 0 } : c,
      ),
    )

    // Fake delivery: 'sent' → 'delivered' → 'read'
    setTimeout(() => {
      setThreads((prev) => markStatus(prev, sent.id, 'delivered'))
    }, 600)
    setTimeout(() => {
      setThreads((prev) => markStatus(prev, sent.id, 'read'))
    }, 1200)

    // Fake reply from the contact
    setTimeout(() => {
      const reply = {
        id: `them-${Date.now()}`,
        contactId: selectedContact.id,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        time: new Date(),
        fromMe: false,
        status: null,
      }
      setThreads((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] ?? []), reply],
      }))
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id ? { ...c, lastMessage: reply.text, timestamp: reply.time } : c,
        ),
      )
    }, 1500)
  }

  return {
    contacts: filteredContacts, // already sorted + filtered by search
    selectedContact,
    selectedMessages,
    search,
    setSearch,
    selectContact,
    clearSelected,
    sendMessage,
  }
}

/** Tiny helper: flip the status field of one message inside a thread map */
function markStatus(prev, messageId, status) {
  return Object.fromEntries(
    Object.entries(prev).map(([contactId, thread]) => [
      contactId,
      thread.map((m) => (m.id === messageId ? { ...m, status } : m)),
    ]),
  )
}