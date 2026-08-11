// Right column: the open chat (header, messages, composer) or an
// empty state on desktop when nothing is selected.
// On small screens the sidebar hides instead, and the header's back
// button returns to the chat list.

import { MessageCircle } from 'lucide-react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatWindow({ contact, messages, onBack, onSend }) {
  return (
    <section className="flex-1 min-w-0 h-full flex flex-col bg-paper">
      {contact ? (
        <>
          <ChatHeader contact={contact} onBack={onBack} />
          <MessageList contact={contact} messages={messages} />
          <MessageInput onSend={onSend} />
        </>
      ) : (
        // desktop empty state, hidden on mobile where the list shows instead
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="p-8 rounded-xl border border-dashed border-line text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-cobalt/15 text-cobalt grid place-content-center mx-auto mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <p className="font-display font-semibold text-lg tracking-tight">
              Pick a chat to start messaging
            </p>
            <p className="text-sm text-slate mt-1">
              Select a conversation from the list on the left.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}