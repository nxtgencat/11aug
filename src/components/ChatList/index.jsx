// ============================================================
// ChatList/index.jsx — scrollable list of contacts, rendered
// with .map(). Shows an empty state when search finds nothing.
// ============================================================

import { SearchX } from 'lucide-react'
import ChatItem from '../ChatItem'

export default function ChatList({ contacts, selectedContactId, onSelectContact }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {contacts.length === 0 ? (
        // Search empty state (dashed panel, per the design system)
        <div className="m-3 p-8 rounded-xl border border-dashed border-line text-center">
          <div className="w-10 h-10 rounded-full bg-ink/5 grid place-content-center mx-auto mb-3">
            <SearchX className="w-4 h-4 text-slate" />
          </div>
          <p className="text-sm font-medium">No results found</p>
          <p className="text-xs text-slate mt-1">Try a different name</p>
        </div>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <ChatItem
              key={contact.id}
              contact={contact}
              active={contact.id === selectedContactId}
              onSelect={() => onSelectContact(contact.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}