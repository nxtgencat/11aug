// Left column: header with the user name and logout button, the
// search bar, and the scrollable chat list.

import { LogOut, Search } from 'lucide-react'
import Logo from './Logo'
import ChatList from './ChatList'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar({ contacts, search, onSearch, onSelectContact, selectedContactId }) {
  const { user, logout } = useAuth()

  return (
    <aside className="w-full lg:w-[380px] shrink-0 h-full flex flex-col bg-surface border-r border-line">
      {/* profile header */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-line">
        <Logo />
        <div className="flex items-center gap-2">
          <span
            className="hidden sm:block text-sm text-slate max-w-32 truncate"
            title={user?.email}
          >
            {user?.name}
          </span>
          <button
            type="button"
            onClick={logout}
            className="btn-icon"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* search */}
      <div className="p-3 shrink-0 border-b border-line">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search contacts"
            className="field pl-10"
          />
        </div>
      </div>

      <ChatList
        contacts={contacts}
        selectedContactId={selectedContactId}
        onSelectContact={onSelectContact}
      />
    </aside>
  )
}