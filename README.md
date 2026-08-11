# Chatter — WhatsApp-style Chat App (React + Tailwind CSS)

A fully responsive, WhatsApp-style chat interface built with **React (Vite)** and **Tailwind CSS v4**.

Authentication is mocked, all contacts and messages are dummy data — the focus of this
project is **UI implementation, component structure, and responsive design**.

> Design system: every color, font, radius, shadow, and layout pattern follows the
> [Tearline design reference](design/tearline/index.html) (paper/surface/ink palette,
> Space Grotesk + Inter + IBM Plex Mono, pill buttons, rounded bubbles).

---

## What was built

| Area | Features |
| ---- | -------- |
| **Authentication** | Login, Signup, and Forgot-password pages. Client-side form validation (email format, password length, confirm-password match), show/hide password toggle, mocked session persisted in `localStorage`, logout button in the sidebar. |
| **Chat layout** | Two-column desktop layout (contact list + chat window) that switches to a single panel on mobile with a back button to return to the list. |
| **50 dummy contacts** | Stored in `src/data/contacts.js` and rendered dynamically with `.map()`. Each contact has an id, unique name, tinted avatar (initials), last message, timestamp, online/last-seen status, unread count, pinned flag, and muted flag. |
| **Chat list** | Avatar with online dot, name, last-message preview, relative timestamp (Today / Yesterday / weekday / date), unread badge, pin and mute indicators, search with empty state, hover and active-chat states, scrollable list, pinned contacts sorted to the top. |
| **Chat window** | Header with avatar + online/last-seen text, day separators between messages, sent (cobalt) vs received (white) bubbles with the design system's tail corner, timestamps, and delivery ticks for our own messages (sent ✓ / delivered ✓✓ / read ✓✓ in mint). |
| **Messaging (demo)** | Type a message and press Enter or the send button: it appears with `sent → delivered → read` ticks, updates the chat list preview, and the contact replies with a canned auto-reply after 1.5 s. |
| **Responsive** | Desktop & laptop: both columns. Tablet & mobile: one panel at a time + back button. |

---

## Technical decisions

### Plain JSX (not TypeScript)
The starter template ships with `.tsx` files, but the project brief specifies `App.jsx` /
`main.jsx`. Plain JSX keeps the code more approachable for beginners, and the build script
was changed from `tsc -b && vite build` to a plain `vite build`.

### Layer separation: UI vs data
The app is split so presentational components never talk to data directly:

- **Data layer** — `src/data/` (static mock data), `src/utils/` (date/validation helpers),
  `src/context/` (auth state), `src/hooks/useChat.js` (all chat state + actions).
- **UI layer** — `src/components/` (presentational components) and `src/pages/`
  (auth screens). Components receive data and callback functions as props only.

One hook (`useChat`) owns the chat state, so switching the mock data for a real API later
means touching just that file.

### Design tokens as a Tailwind `@theme`
The Tearline palette, fonts, radii, shadows, and the `fadeUp` animation are declared in
`src/index.css` via Tailwind v4's `@theme` block, so utilities like `bg-cobalt`,
`font-display`, and `shadow-glow` exist everywhere. Repeated patterns (`btn-primary`,
`btn-ghost`, `.field`, `.card`) are `@apply`-ed component classes copied from the design
system.

### Mocked auth flow
`AuthContext` keeps a `user` object in state, mirrors it to `localStorage` (so a reload
keeps you logged in), and provides `login / signup / logout`. Forms validate themselves;
any valid-looking credential is accepted — no backend involved.

### Why contacts/messages are generated with a seeded random
The 50 contacts are built by pairing two lists of 50 unique first/last names with simple
index patterns (every 4th online, every 10th pinned, ...). A tiny seeded PRNG
(pseudo-random number generator) makes results **deterministic** — every page load shows
the same fake conversations, but the data file stays short enough to read in one sitting.

### Responsive strategy
One layout with breakpoint classes instead of separate mobile/desktop trees:

- `lg:` (≥1024px): sidebar and chat window always visible.
- below `lg`: only one panel at a time — `App.jsx` toggles `hidden`/`flex` based on
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
    ├── App.jsx                   # Top-level shell: auth pages ↔ chat app, responsive toggle
    ├── index.css                 # Tailwind import + @theme tokens + .btn-*/field/card classes
    │
    ├── components/
    │   ├── Sidebar/              # Left column: logo + logout, search bar, scrollable list
    │   ├── ChatList/             # .map()s contacts, search empty state
    │   ├── ChatItem/             # One row: avatar, preview, time, unread, pin/mute icons
    │   ├── ChatWindow/           # Right column: header + messages + input (or empty state)
    │   ├── ChatHeader/           # Avatar, name, online/last seen, back button (mobile)
    │   ├── MessageList/          # Scrollable thread, day separators, auto-scroll to bottom
    │   ├── MessageBubble/        # Sent (cobalt) vs received (white) bubble + ticks
    │   ├── MessageInput/         # Text field + send button, Enter to send
    │   ├── Avatar.jsx            # Initials avatar with optional online dot (shared)
    │   ├── Logo.jsx              # Brand tile (shared with auth pages)
    │   ├── AuthLayout.jsx        # Centered auth card shell with decorative blobs
    │   └── PasswordField.jsx     # Password input + show/hide eye + ErrorText helper
    │
    ├── pages/
    │   ├── LoginPage.jsx         # Mock login with validation
    │   ├── SignupPage.jsx        # Mock signup with validation
    │   └── ForgotPasswordPage.jsx# Mock reset → success state
    │
    ├── data/
    │   ├── contacts.js           # 50 unique dummy contacts (names, status, badges...)
    │   └── messages.js           # Dummy conversation generator + auto-reply pool
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

**Trying it out:** any email works — just need a 6+ character password on the login screen
(`you@example.com` + `123456`). Click a contact, send a message, and watch the mock reply
arrive. Resize the window (or use DevTools mobile mode) to see the single-panel layout.