// Initials avatar with a mint online dot.
// variant: 'list' (44px) | 'header' (40px) | 'bubble' (28px)

const TINTS = {
  cobalt: 'bg-cobalt/15 text-cobalt',
  mint: 'bg-mint/15 text-mint',
  amber: 'bg-amber/15 text-amber',
  rose: 'bg-rose/15 text-rose',
  ink: 'bg-ink/10 text-ink',
  slate: 'bg-slate/10 text-slate',
}

const SIZES = {
  list: 'w-11 h-11 text-sm',
  header: 'w-10 h-10 text-sm',
  bubble: 'w-7 h-7 text-[10px]',
}

// First letters of the first two words: "Ava Chen" -> "AC"
function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ contact, variant = 'list', showStatus = true }) {
  const dotSize = variant === 'bubble' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'

  return (
    <div className="relative shrink-0">
      <span
        className={`${SIZES[variant]} ${TINTS[contact.avatarColor]} rounded-full grid place-content-center font-semibold select-none`}
      >
        {initials(contact.name)}
      </span>

      {/* online dot, only when the contact is online right now */}
      {showStatus && contact.online && (
        <span
          className={`absolute bottom-0 right-0 ${dotSize} rounded-full bg-mint ring-2 ring-surface`}
        />
      )}
    </div>
  )
}