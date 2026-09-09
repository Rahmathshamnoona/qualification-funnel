import { useEffect, useState } from 'react'

const TICKS = [
  { at: 0, label: 'Reviewing your responses' },
  { at: 1400, label: 'Scoring eligibility' },
  { at: 2800, label: 'Matching with the right advisor' },
]

type Props = {
  onDone: () => void
}

export function Matching({ onDone }: Props) {
  const [percent, setPercent] = useState(0)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let frame = 0
    const duration = 4200
    const loop = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setPercent(Math.round(t * 100))
      if (t < 1) frame = requestAnimationFrame(loop)
      else onDone()
    }
    frame = requestAnimationFrame(loop)
    const timers = TICKS.slice(1).map((item, index) => setTimeout(() => setTick(index + 1), item.at))
    return () => {
      cancelAnimationFrame(frame)
      timers.forEach(clearTimeout)
    }
  }, [onDone])

  const radius = 56
  const circ = 2 * Math.PI * radius
  const offset = circ * (1 - percent / 100)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f5f5f0] px-5">
      <p className="mb-3.5 text-center text-[13px] text-[#6b7280]">
        You may qualify for up to <strong className="text-[#1a1a1a]">$4,152/month*</strong> in benefits
      </p>
      <div className="flex w-full max-w-[380px] flex-col items-center rounded-[20px] bg-white px-5 pt-12 pb-9 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
        <div className="relative mb-6 h-[120px] w-[120px]">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="7" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={percent >= 100 ? '#22C55E' : '#3B82F6'}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">{percent}%</div>
        </div>
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e]">
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5l3.5 3.5 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[15px] font-semibold text-[#1a1a1a]">{TICKS[tick]?.label}</span>
        </div>
        <p className="flex items-center gap-2 text-[13px] text-[#9ca3af]">256-bit encrypted • Your data is never sold</p>
      </div>
    </div>
  )
}
