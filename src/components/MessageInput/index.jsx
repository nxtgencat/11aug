// ============================================================
// MessageInput/index.jsx — the composer at the bottom of the
// chat window: attachment button (decorative), text field and
// a round send button that copies the design system's mini
// chat widget.
//
// Enter ↲ or the send button sends the message.
// ============================================================

import { useState } from 'react'
import { ArrowUp, Paperclip } from 'lucide-react'

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')

  /** Clear the field after handing the text up to useChat */
  function handleSend() {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <footer className="shrink-0 bg-surface border-t border-line">
      <div className="flex items-center gap-2 p-3 max-w-2xl mx-auto">
        {/* Attachment (decorative for this demo) */}
        <button type="button" className="btn-icon" aria-label="Attach file">
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
          className="flex-1 min-w-0 field"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-9 h-9 rounded-full bg-cobalt text-white grid place-content-center shrink-0 transition-all hover:bg-cobalt-dark active:scale-95 disabled:bg-line disabled:text-slate/50 disabled:hover:bg-line cursor-pointer disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  )
}