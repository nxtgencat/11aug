// Central chat state: contacts, threads, the open chat, and search.
// Components only read from this hook and call its actions.

import { useMemo, useState } from 'react'
import { contacts as seedContacts } from '../data/contacts'
import { buildContactMessages, AUTO_REPLIES } from '../data/messages'

export function useChat() {
  // Contacts are state so the UI can update them (clear unread,
  // change the preview, reorder the list) without reloading data.
  const [contacts, setContacts] = useState(seedContacts)

  // Threads by contact id, built the first time a chat is opened
  const [threads, setThreads] = useState({})

  const [selectedContactId, setSelectedContactId] = useState(null)
  const [search, setSearch] = useState('')

  // --- derived values ------------------------------------------------

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || null

  const selectedMessages = useMemo(() => {
    if (selectedContactId === null) return []
    return (
      threads[selectedContactId] ??
      buildContactMessages(selectedContact, selectedContactId)
    )
  }, [threads, selectedContactId, selectedContact])

  // Pinned contacts first, then most recent
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.timestamp - a.timestamp
    })
  }, [contacts])

  // Search matches against the contact name
  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sortedContacts
    return sortedContacts.filter((c) => c.name.toLowerCase().includes(q))
  }, [sortedContacts, search])

  // --- actions ---------------------------------------------------------

  // Open a chat and clear its unread count
  function selectContact(id) {
    setSelectedContactId(id)
    setContacts((prev) =>
      prev.map((c) => (c.id === id && c.unread > 0 ? { ...c, unread: 0 } : c)),
    )
  }

  // Mobile back button: return to the chat list
  function clearSelected() {
    setSelectedContactId(null)
  }

  // Add the message, then simulate delivery ticks (sent, delivered,
  // read) and an auto-reply with short timeouts, since there is no
  // real backend to respond.
  function sendMessage(text) {
    if (!selectedContact || !text.trim()) return

    const sent = {
      id: `me-${Date.now()}`,
      contactId: selectedContact.id,
      text: text.trim(),
      time: new Date(),
      fromMe: true,
      status: 'sent',
    }

    // Append to the thread, creating one if this chat has none yet
    setThreads((prev) => ({
      ...prev,
      [selectedContact.id]: [
        ...(prev[selectedContact.id] ?? buildContactMessages(selectedContact, selectedContact.id)),
        sent,
      ],
    }))

    // Bump the contact to the top of the list
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id ? { ...c, lastMessage: sent.text, timestamp: sent.time, unread: 0 } : c,
      ),
    )

    // Fake delivery: sent, then delivered, then read
    setTimeout(() => {
      setThreads((prev) => markStatus(prev, sent.id, 'delivered'))
    }, 600)
    setTimeout(() => {
      setThreads((prev) => markStatus(prev, sent.id, 'read'))
    }, 1200)

    // Auto-reply from the contact
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
    contacts: filteredContacts,
    selectedContact,
    selectedMessages,
    search,
    setSearch,
    selectContact,
    clearSelected,
    sendMessage,
  }
}

// Sets the status of one message inside a thread map
function markStatus(prev, messageId, status) {
  return Object.fromEntries(
    Object.entries(prev).map(([contactId, thread]) => [
      contactId,
      thread.map((m) => (m.id === messageId ? { ...m, status } : m)),
    ]),
  )
}