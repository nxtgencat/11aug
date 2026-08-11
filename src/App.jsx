// ============================================================
// App.jsx — top-level shell.
//
// Logged out → login / signup / forgot-password pages
// Logged in  → two-column chat layout
//
// Responsive: on desktop (lg+) both columns are always visible.
// On smaller screens only one is shown at a time — opening a
// chat replaces the list, and the back button goes back.
// ============================================================

import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { useChat } from './hooks/useChat'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { user } = useAuth()

  // Which auth screen to show: 'login' | 'signup' | 'forgot'
  const [authView, setAuthView] = useState('login')

  if (!user) {
    if (authView === 'signup')
      return <SignupPage onShowLogin={() => setAuthView('login')} />
    if (authView === 'forgot')
      return <ForgotPasswordPage onShowLogin={() => setAuthView('login')} />
    return <LoginPage onShowSignup={() => setAuthView('signup')} onShowForgot={() => setAuthView('forgot')} />
  }

  return <ChatApp />
}

// --- the actual chat application -------------------------------------

function ChatApp() {
  const chat = useChat()

  // Mobile: when a chat is open the list is hidden (and vice versa).
  // Desktop (lg+): both columns are always rendered side by side.
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
        />
      </div>
    </div>
  )
}

export default App