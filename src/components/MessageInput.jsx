// Composer at the bottom of the chat window: attachment menu
// (image / video / document / contact), previews, emoji picker,
// and a mic button for voice notes. The send button replaces the
// mic while there is text or media.

import { useEffect, useRef, useState } from 'react'
import {
  ArrowUp,
  FileText,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Smile,
  Square,
  User,
  Video,
  X,
} from 'lucide-react'
import { EMOJIS } from '../data/emojis'
import { formatDuration } from '../utils/format'

// Sample contacts for the "Contact" attachment, since this is a demo
const SAMPLE_CONTACTS = [
  { name: 'Mia Chen', phone: '+86 138 0000 0001' },
  { name: 'Noah Kim', phone: '+82 10 5555 0102' },
  { name: 'Emma Garcia', phone: '+34 600 555 0103' },
  { name: 'Leo Novak', phone: '+1 555 019 0104' },
]

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')
  const [media, setMedia] = useState([])
  const [showEmoji, setShowEmoji] = useState(false)
  const [attachOpen, setAttachOpen] = useState(false)

  // recording state
  const [recording, setRecording] = useState(false)
  const [recSeconds, setRecSeconds] = useState(0)
  const secondsRef = useRef(0)
  const timerRef = useRef(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const fakeRef = useRef(false)
  const sendRef = useRef(false)

  const footerRef = useRef(null)
  const fileRef = useRef(null)
  const fileKindRef = useRef('image')

  // Close the emoji picker and attach menu when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (footerRef.current && !footerRef.current.contains(e.target)) {
        setShowEmoji(false)
        setAttachOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Clean up timers and a half-finished recording on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    }
  }, [])

  function handleSend() {
    if (!text.trim() && media.length === 0) return
    onSend({ text, media })
    setText('')
    setMedia((prev) => {
      prev.forEach((m) => m.url && URL.revokeObjectURL(m.url))
      return []
    })
    setShowEmoji(false)
  }

  // --- attachments -----------------------------------------------------

  // Open the file picker with the right accept filter for this kind
  function openFilePicker(kind) {
    fileKindRef.current = kind
    fileRef.current.accept =
      kind === 'image' ? 'image/*' : kind === 'video' ? 'video/*' : ''
    fileRef.current.click()
    setAttachOpen(false)
  }

  function pickFiles(event) {
    const kind = fileKindRef.current
    const files = Array.from(event.target.files || []).slice(0, 4)
    if (files.length === 0) return
    setMedia((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${Date.now()}-${file.name}`,
        kind,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size,
      })),
    ])
    event.target.value = ''
  }

  // Contact attachment: a fake vCard-style card
  function addContact() {
    const c = SAMPLE_CONTACTS[Math.floor(Math.random() * SAMPLE_CONTACTS.length)]
    setMedia((prev) => [
      ...prev,
      { id: `${Date.now()}-contact`, kind: 'contact', name: c.name, phone: c.phone },
    ])
    setAttachOpen(false)
  }

  function removeMedia(id) {
    setMedia((prev) => {
      const target = prev.find((m) => m.id === id)
      if (target?.url) URL.revokeObjectURL(target.url)
      return prev.filter((m) => m.id !== id)
    })
  }

  // --- voice notes -----------------------------------------------------

  function startTimer() {
    stopTimer()
    secondsRef.current = 0
    setRecSeconds(0)
    timerRef.current = setInterval(() => {
      secondsRef.current += 1
      setRecSeconds(secondsRef.current)
    }, 1000)
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Try the microphone for a real recording; if permission is denied
  // or unsupported, fall back to a fake voice note with just a length.
  async function startMic() {
    fakeRef.current = false
    startTimer()
    setRecording(true)

    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('no media api')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream)
      const chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      recorder.onstop = () => {
        stopTimer()
        stream.getTracks().forEach((t) => t.stop())
        streamRef.current = null
        recorderRef.current = null
        setRecording(false)
        if (sendRef.current && chunks.length > 0) {
          onSend({
            voice: {
              url: URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })),
              duration: secondsRef.current,
            },
          })
        }
      }
      recorderRef.current = recorder
      recorder.start()
    } catch {
      fakeRef.current = true
    }
  }

  function stopMic(send) {
    sendRef.current = send
    if (recorderRef.current) {
      if (recorderRef.current.state === 'recording') recorderRef.current.stop()
      return
    }
    // fake recording path
    stopTimer()
    setRecording(false)
    if (send) onSend({ voice: { duration: secondsRef.current } })
  }

  const canSend = Boolean(text.trim() || media.length)

  return (
    <footer ref={footerRef} className="relative shrink-0 bg-surface border-t border-line">
      <div className="relative max-w-2xl mx-auto">
        {/* emoji picker */}
        {showEmoji && (
          <EmojiPanel
            onPick={(emoji) => setText((t) => t + emoji)}
            onClose={() => setShowEmoji(false)}
          />
        )}

        {/* attachment menu */}
        {attachOpen && (
          <AttachMenu
            onImage={() => openFilePicker('image')}
            onVideo={() => openFilePicker('video')}
            onDocument={() => openFilePicker('document')}
            onContact={addContact}
            onClose={() => setAttachOpen(false)}
          />
        )}

        {/* attachment previews */}
        {media.length > 0 && !recording && (
          <div className="flex gap-2.5 px-3 pt-3 flex-wrap">
            {media.map((m) => (
              <AttachmentTile key={m.id} item={m} onRemove={() => removeMedia(m.id)} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 p-3">
          {recording ? (
            /* recording row */
            <>
              <button
                type="button"
                onClick={() => stopMic(false)}
                className="btn-icon"
                aria-label="Cancel recording"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="w-2.5 h-2.5 rounded-full bg-rose animate-pulse shrink-0" />
              <span className="font-mono text-xs text-slate tabular-nums">
                {formatDuration(recSeconds)}
              </span>
              <div className="flex-1 h-px bg-line" />
              <span className="text-xs text-slate">Recording</span>
              <button
                type="button"
                onClick={() => stopMic(true)}
                className="w-9 h-9 rounded-full bg-cobalt text-white grid place-content-center hover:bg-cobalt-dark transition-colors"
                aria-label="Send voice message"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              {/* attachment menu toggle */}
              <button
                type="button"
                onClick={() => {
                  setAttachOpen((o) => !o)
                  setShowEmoji(false)
                }}
                className={`btn-icon ${attachOpen ? 'bg-cobalt text-white border-cobalt hover:border-cobalt hover:text-white' : ''}`}
                aria-label="Attach"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={pickFiles}
              />

              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={media.length > 0 ? 'Add a caption (optional)' : 'Type a message'}
                className="flex-1 min-w-0 field"
              />

              {/* emoji picker toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowEmoji((s) => !s)
                  setAttachOpen(false)
                }}
                className={`btn-icon ${showEmoji ? 'bg-cobalt text-white border-cobalt hover:border-cobalt hover:text-white' : ''}`}
                aria-label="Emoji picker"
              >
                <Smile className="w-4 h-4" />
              </button>

              {canSend ? (
                <button
                  type="button"
                  onClick={handleSend}
                  className="w-9 h-9 rounded-full bg-cobalt text-white grid place-content-center shrink-0 transition-all hover:bg-cobalt-dark active:scale-95 cursor-pointer"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startMic}
                  className="w-9 h-9 rounded-full bg-cobalt text-white grid place-content-center shrink-0 transition-all hover:bg-cobalt-dark active:scale-95 cursor-pointer"
                  aria-label="Record voice message"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </footer>
  )
}

// Small emoji palette, aligned to the composer column. Clicking an
// emoji appends it to the draft; the panel stays open for another pick.
function EmojiPanel({ onPick, onClose }) {
  return (
    <div className="absolute bottom-full left-3 right-3 mb-1 z-20 rounded-xl bg-surface border border-line shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-line">
        <span className="font-mono text-[10px] tracking-widest text-slate uppercase">Emoji</span>
        <button
          type="button"
          onClick={onClose}
          className="btn-icon !w-7 !h-7"
          aria-label="Close emoji picker"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-8 gap-1 p-2.5 max-h-44 overflow-y-auto">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onPick(emoji)}
            className="aspect-square grid place-content-center text-xl rounded-lg hover:bg-ink/5 transition-colors cursor-pointer"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

// Attach menu, like WhatsApp's: image, video, document, or contact
function AttachMenu({ onImage, onVideo, onDocument, onContact, onClose }) {
  const items = [
    { label: 'Images', icon: ImageIcon, color: 'text-mint bg-mint/10', action: onImage },
    { label: 'Video', icon: Video, color: 'text-cobalt bg-cobalt/10', action: onVideo },
    { label: 'Document', icon: FileText, color: 'text-amber bg-amber/10', action: onDocument },
    { label: 'Contact', icon: User, color: 'text-rose bg-rose/10', action: onContact },
  ]

  return (
    <div className="absolute bottom-full left-3 right-3 mb-1 z-20 rounded-xl bg-surface border border-line shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-line">
        <span className="font-mono text-[10px] tracking-widest text-slate uppercase">Attach</span>
        <button
          type="button"
          onClick={onClose}
          className="btn-icon !w-7 !h-7"
          aria-label="Close attach menu"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-1.5">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-ink/5 transition-colors cursor-pointer"
          >
            <span className={`w-9 h-9 rounded-full grid place-content-center ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// A preview tile for one pending attachment
function AttachmentTile({ item, onRemove }) {
  let preview
  if (item.kind === 'image') {
    preview = <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
  } else if (item.kind === 'video') {
    preview = (
      <>
        <video src={item.url} muted preload="metadata" className="w-full h-full object-cover" />
        <span className="absolute inset-0 grid place-content-center text-white bg-ink/20">
          <Video className="w-5 h-5" />
        </span>
      </>
    )
  } else if (item.kind === 'document') {
    preview = (
      <div className="w-full h-full bg-ink/5 grid place-content-center text-slate">
        <FileText className="w-6 h-6" />
      </div>
    )
  } else {
    // contact
    const initials = item.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
    preview = (
      <div className="w-full h-full bg-cobalt/10 grid place-content-center text-cobalt font-semibold text-sm">
        {initials}
      </div>
    )
  }

  return (
    <div className="w-16">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-line shadow-sm">
        {preview}
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-ink text-white grid place-content-center hover:bg-cobalt transition-colors"
          aria-label={`Remove ${item.name}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <p className="text-[10px] text-slate truncate mt-1">
        {item.kind === 'contact' ? item.name : item.name}
      </p>
    </div>
  )
}