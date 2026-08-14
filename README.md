# Chatter: WhatsApp-style chat app (React + Tailwind CSS)

A fully responsive, WhatsApp-style chat interface built with **React (Vite)** and **Tailwind CSS v4**.

Authentication is mocked and all contacts and messages are dummy data. The focus of this
project is UI implementation, component structure, and responsive design.

---

## What was built

| Area | Features |
| ---- | -------- |
| **Authentication** | Phone-number sign-in with a mock OTP (any 6-digit code works). Mocked session persisted in `localStorage`, logout button in the sidebar. |
| **Chat layout** | Two-column desktop layout (contact list + chat window) that switches to a single panel on mobile with a back button to return to the list. |
| **50 dummy contacts** | Stored in `src/data/contacts.js` and rendered dynamically with `.map()`. Each contact has an id, unique name, tinted avatar (initials), last message, timestamp, online/last-seen status, unread count, pinned flag, and muted flag. |
| **Chat list** | Avatar with online dot, name, last-message preview, relative timestamp (Today / Yesterday / weekday / date), unread badge, pin and mute indicators, search with empty state, hover and active-chat states, scrollable list, pinned contacts sorted to the top. |
| **Chat window** | Header with avatar + online/last-seen text, day separators between messages, sent (cobalt) vs received (white) bubbles, timestamps, and delivery ticks for our own messages (sent ✓ / delivered ✓✓ / read ✓✓ in mint). |
| **Messaging (demo)** | Type a message and press Enter or the send button: it appears with `sent → delivered → read` ticks, updates the chat list preview, and the contact replies with a canned auto-reply after 1.5 s. |
| **Media & voice** | An attach menu offers images, video, documents, and contact cards, each with previews and remove buttons before sending. The mic records a real voice note (falls back to a fake one if the microphone is denied), with an animated waveform, duration, and play/pause playback in the bubble. |
| **Emoji picker** | A palette of 60+ emojis above the composer; picking appends to the draft. Messages that are just emoji render large, like WhatsApp. |
| **Chat options** | A menu in the chat header toggles mute and pin per chat. Pinning re-sorts the list to the top, and mute/pin states show in the chat list. |
| **Phone sign-in** | The only way in: country code + number, then a mock OTP step. Any 6-digit code is accepted since there is no SMS. |
| **Responsive** | Desktop & laptop: both columns. Tablet & mobile: one panel at a time + back button. |

---

## Technical decisions

### Plain JSX (not TypeScript)
The starter template ships with `.tsx` files, but the project brief specifies `App.jsx` /
`main.jsx`. Plain JSX keeps the code approachable for beginners, and the build script runs
a plain `vite build`.

### Layer separation: UI vs data
The app is split so presentational components never talk to data directly:

- Data layer: `src/data/` (static mock data), `src/utils/` (date and validation helpers),
  `src/context/` (auth state), `src/hooks/useChat.js` (all chat state and actions).
- UI layer: `src/components/` (presentational components) and `src/pages/`
  (auth screens). Components receive data and callback functions as props only.

One hook (`useChat`) owns the chat state, so switching the mock data for a real API later
means touching just that file.

### Design tokens as a Tailwind `@theme`
Colors, fonts, radii, shadows, and the `fadeUp` animation are declared in `src/index.css`
via Tailwind v4's `@theme` block, so utilities like `bg-cobalt`, `font-display`, and
`shadow-glow` exist everywhere. Repeated patterns (`btn-primary`, `btn-ghost`, `.field`,
`.card`) are defined once as `@apply`-ed component classes.

### Mocked auth flow
`AuthContext` keeps a `user` object in state, mirrors it to `localStorage` (so a reload
keeps you logged in), and provides `loginWithPhone / logout`. There is no backend, and
any 6-digit OTP is accepted in place of a real SMS.

### Why contacts and messages are generated with a seeded random
The 50 contacts are built by pairing two lists of 50 unique first and last names with
simple index patterns (every 4th online, every 10th pinned, ...). A tiny seeded PRNG
(pseudo-random number generator) makes results deterministic: every page load shows the
same fake conversations, but the data file stays short enough to read in one sitting.

### Responsive strategy
One layout with breakpoint classes instead of separate mobile and desktop trees:

- `lg:` (≥1024px): sidebar and chat window always visible.
- below `lg`: only one panel at a time. `App.jsx` toggles `hidden`/`flex` based on
  whether a chat is selected, and the back button calls `clearSelected()`.

---

## Project structure

```
11aug/
├── index.html                    # HTML shell: fonts (Space Grotesk/Inter/Plex Mono), title
├── vite.config.ts                # Vite + React + Tailwind CSS plugins
├── package.json                  # deps + scripts (dev / build / preview / lint)
└── src/
    ├── main.jsx                  # React entry point (renders <App/>)
    ├── App.jsx                   # Top-level shell: phone sign-in ↔ chat app, responsive toggle
    ├── index.css                 # Tailwind import + @theme tokens + .btn-*/field/card classes
    │
    ├── components/
    │   ├── Sidebar.jsx            # Left column: logo + logout, search bar, scrollable list
    │   ├── ChatList.jsx           # .map()s contacts, search empty state
    │   ├── ChatItem.jsx           # One row: avatar, preview, time, unread, pin/mute icons
    │   ├── ChatWindow.jsx         # Right column: header + messages + input (or empty state)
    │   ├── ChatHeader.jsx         # Avatar, name, online/last seen, back button (mobile)
    │   ├── MessageList.jsx        # Scrollable thread, day separators, auto-scroll to bottom
    │   ├── MessageBubble.jsx      # Sent (cobalt) vs received (white) bubble + ticks
    │   ├── MessageInput.jsx       # Composer: attach menu, emoji picker, mic recording
    │   ├── VoiceNote.jsx          # Voice message: waveform, duration, play/pause
    │   ├── Avatar.jsx             # Initials avatar with optional online dot (shared)
    │   ├── Logo.jsx              # Brand tile (shared with the sign-in page)
    │   └── AuthLayout.jsx        # Centered auth card shell + ErrorText helper
    │
    ├── pages/
    │   └── LoginPage.jsx         # Phone number + mock OTP sign-in
    │
    ├── data/
    │   ├── contacts.js            # 50 unique dummy contacts (names, status, badges...)
    │   ├── messages.js            # Dummy conversation generator + auto-reply pool
    │   └── emojis.js              # Emoji palette for the picker
    │
    ├── hooks/
    │   ├── useChat.js            # Central chat state: threads, selection, search, send
    │   └── useAuth.js            # Reads authentication from context
    │
    ├── context/
    │   ├── AuthContext.jsx       # AuthProvider (user state + localStorage)
    │   └── auth.js               # The context object itself (split for Fast Refresh)
    │
    └── utils/
        ├── format.js             # Relative time / last-seen / day labels
        └── validation.js         # isValidEmail()
```

---

## How to run

Requires **Node.js 20+** (tested with Node 26 / pnpm 11).

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server (http://localhost:5173)
pnpm dev
```

Other scripts:

```bash
pnpm build    # production build → dist/
pnpm preview  # serve the production build locally
pnpm lint     # oxlint checks
```

Trying it out: log in with any phone number (6+ digits) and any 6-digit OTP. Click a
contact, send a message, and watch the mock reply arrive. Resize the window (or use
DevTools mobile mode) to see the single-panel layout.
