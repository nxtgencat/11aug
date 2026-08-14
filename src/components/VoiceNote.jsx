// A voice message in the chat: play button, waveform bars, and a
// progress overlay. Real recordings (with an audio url) play via an
// <audio> element; fake ones just walk the progress bar.

import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { formatDuration } from '../utils/format'

export default function VoiceNote({ voice, variant = 'sent' }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef(null)

  const isSent = variant === 'sent'

  // Deterministic bar heights from the note length, so the same
  // message always shows the same waveform
  const bars = useMemo(() => barHeights(voice.duration || 10), [voice.duration])

  function toggle() {
    if (voice.url) {
      const el = audioRef.current
      if (!el) return
      if (playing) {
        el.pause()
      } else {
        el.currentTime = 0
        el.play()
        setPlaying(true)
      }
    } else {
      setPlaying((p) => !p)
    }
  }

  // Real audio: track time and stop at the end
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0)
    const onEnd = () => {
      setPlaying(false)
      setProgress(0)
    }
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('ended', onEnd)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('ended', onEnd)
    }
  }, [voice.url])

  // Fake audio (no url): step the progress bar to the full length
  useEffect(() => {
    if (voice.url || !playing) return
    let step = 0
    const id = setInterval(() => {
      step += 1
      setProgress(step / voice.duration)
      if (step >= voice.duration) {
        clearInterval(id)
        setPlaying(false)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [playing, voice.url, voice.duration])

  return (
    <div className="flex items-center gap-2.5">
      {voice.url && <audio ref={audioRef} src={voice.url} preload="none" />}

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Play'}
        className={`w-9 h-9 rounded-full grid place-content-center shrink-0 transition-transform active:scale-95 ${
          isSent ? 'bg-white/25 text-white' : 'bg-cobalt text-white'
        }`}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <div className="flex-1 flex items-end gap-[3px] h-6">
        {bars.map((height, i) => (
          <span key={i} className="relative w-[3px]" style={{ height: `${height * 100}%` }}>
            <span
              className={`absolute inset-0 rounded-full ${isSent ? 'bg-white/40' : 'bg-slate/30'}`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 rounded-full ${
                isSent ? 'bg-white/90' : 'bg-cobalt'
              }`}
              style={{ height: `${progress * 100}%` }}
            />
          </span>
        ))}
      </div>

      <span className={`text-[10px] font-mono tabular-nums ${isSent ? 'text-white/90' : 'text-slate'}`}>
        {formatDuration(voice.duration)}
      </span>
    </div>
  )
}

// Small deterministic PRNG for stable bar heights
function barHeights(seed) {
  let s = seed * 73 + 7
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  return Array.from({ length: 24 }, () => 0.3 + rnd() * 0.7)
}