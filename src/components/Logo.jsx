// Brand mark: the design system's rotated letter tile
export default function Logo({ size = 'md', showName = true }) {
  const tile = size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm'

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <span
        className={`${tile} rounded-md bg-ink text-paper grid place-content-center font-display font-semibold rotate-[-4deg]`}
      >
        C
      </span>
      {showName && (
        <span className="font-display font-semibold tracking-tight">Chatter</span>
      )}
    </div>
  )
}