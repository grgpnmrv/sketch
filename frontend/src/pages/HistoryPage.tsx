import { useEffect, useState } from 'react'
import { fetchHistory, type SketchRecord } from '../api'
import { useAppStore } from '../store'
import { Link } from 'react-router-dom'

export default function HistoryPage() {
  const token = useAppStore((s) => s.token)
  const [records, setRecords] = useState<SketchRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetchHistory()
      .then(setRecords)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  if (!token) {
    return (
      <div style={styles.center}>
        <p>You need to be signed in to view your history.</p>
        <Link to="/" style={styles.link}>← Back</Link>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Sketches</h1>
        <Link to="/" style={styles.link}>← Draw again</Link>
      </div>
      {loading && <p style={{ color: '#6b7280' }}>Loading…</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {!loading && records.length === 0 && (
        <p style={{ color: '#6b7280' }}>No sketches yet. Go draw something!</p>
      )}
      <div style={styles.grid}>
        {records.map((r) => (
          <div key={r.id} style={styles.card}>
            <img src={r.image_url} alt="sketch" style={styles.img} />
            <div style={styles.info}>
              <span style={styles.score}>{r.score}/100</span>
              <span style={styles.date}>{new Date(r.created_at).toLocaleDateString()}</span>
              <div style={styles.bullets}>
                {r.feedback_json.green.slice(0, 1).map((g, i) => (
                  <p key={i} style={styles.green}>✓ {g}</p>
                ))}
                {r.feedback_json.yellow.slice(0, 1).map((y, i) => (
                  <p key={i} style={styles.yellow}>→ {y}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 800, margin: '0 auto', padding: '32px 16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700 },
  link: { fontSize: 14, color: '#1a1a1a', fontWeight: 600 },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 48, color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 },
  card: { border: '1.5px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' },
  img: { width: '100%', height: 160, objectFit: 'cover' },
  info: { padding: 12, display: 'flex', flexDirection: 'column', gap: 4 },
  score: { fontSize: 18, fontWeight: 700 },
  date: { fontSize: 12, color: '#9ca3af' },
  bullets: { marginTop: 4 },
  green: { fontSize: 12, color: '#166534', lineHeight: 1.4 },
  yellow: { fontSize: 12, color: '#92400e', lineHeight: 1.4 },
}
