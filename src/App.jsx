import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { useChat } from './hooks/useChat'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { user } = useAuth()

  if (!user) return <LoginPage />

  return <ChatApp />
}

// The chat application itself
function ChatApp() {
  const chat = useChat()

  // On phones only one panel fits, so hide whichever side is inactive.
  // On lg+ screens both columns always show side by side.
  const listVisible = chat.selectedContact ? 'hidden lg:flex' : 'flex'
  const windowVisible = chat.selectedContact ? 'flex' : 'hidden lg:flex'

  return (
    <div className="h-dvh flex overflow-hidden bg-paper">
      <div className={`${listVisible} w-full lg:w-[380px] shrink-0`}>
        <Sidebar
          contacts={chat.contacts}
          search={chat.search}
          onSearch={chat.setSearch}
          selectedContactId={chat.selectedContact?.id ?? null}
          onSelectContact={chat.selectContact}
        />
      </div>
      <div className={`${windowVisible} flex-1 min-w-0`}>
        <ChatWindow
          contact={chat.selectedContact}
          messages={chat.selectedMessages}
          onBack={chat.clearSelected}
          onSend={chat.sendMessage}
          onToggleMute={chat.toggleMute}
          onTogglePin={chat.togglePin}
        />
      </div>
    </div>
  )
}

export default App