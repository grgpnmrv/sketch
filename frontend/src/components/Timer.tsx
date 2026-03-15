import { useEffect, useRef, useState } from 'react'

const TOTAL = 10 * 60 // 10 minutes in seconds

interface TimerProps {
  onExpire?: () => void
}

export default function Timer({ onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(TOTAL)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            onExpire?.()
            return 0
          }
          return r - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, onExpire])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const pct = ((TOTAL - remaining) / TOTAL) * 100

  return (
    <div style={styles.wrap}>
      <div style={styles.display}>{mm}:{ss}</div>
      <div style={styles.bar}>
        <div style={{ ...styles.fill, width: `${pct}%`, background: remaining < 60 ? '#ef4444' : '#22c55e' }} />
      </div>
      <div style={styles.buttons}>
        {!running && remaining === TOTAL && (
          <button style={styles.btn} onClick={() => setRunning(true)}>Start</button>
        )}
        {running && (
          <button style={styles.btn} onClick={() => setRunning(false)}>Pause</button>
        )}
        {!running && remaining < TOTAL && remaining > 0 && (
          <button style={styles.btn} onClick={() => setRunning(true)}>Resume</button>
        )}
        {remaining < TOTAL && (
          <button style={{ ...styles.btn, background: '#e5e7eb', color: '#374151' }}
            onClick={() => { setRunning(false); setRemaining(TOTAL) }}>
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  display: { fontSize: 40, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: 2 },
  bar: { width: 200, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, transition: 'width 0.5s linear' },
  buttons: { display: 'flex', gap: 8 },
  btn: { padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#1a1a1a', color: '#fff', fontWeight: 600 },
}
