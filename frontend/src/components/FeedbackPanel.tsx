import type { Feedback } from '../api'

interface Props {
  feedback: Feedback
  onSave?: () => void
}

export default function FeedbackPanel({ feedback, onSave }: Props) {
  const { score, green, yellow } = feedback

  const scoreColor =
    score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#6b7280'

  return (
    <div style={styles.card}>
      <div style={styles.scoreRow}>
        <span style={styles.scoreLabel}>Score</span>
        <span style={{ ...styles.score, color: scoreColor }}>{score}</span>
        <span style={styles.scoreMax}>/100</span>
      </div>

      {green.length > 0 && (
        <section style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, color: '#16a34a' }}>What you did well</h3>
          <ul style={styles.list}>
            {green.map((item, i) => (
              <li key={i} style={styles.greenItem}>✓ {item}</li>
            ))}
          </ul>
        </section>
      )}

      {yellow.length > 0 && (
        <section style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, color: '#b45309' }}>Areas to explore</h3>
          <ul style={styles.list}>
            {yellow.map((item, i) => (
              <li key={i} style={styles.yellowItem}>→ {item}</li>
            ))}
          </ul>
        </section>
      )}

      {onSave && (
        <button style={styles.saveBtn} onClick={onSave}>
          Save to my history
        </button>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: '#fff', borderRadius: 12, padding: 24, border: '1.5px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 20 },
  scoreRow: { display: 'flex', alignItems: 'baseline', gap: 6 },
  scoreLabel: { fontSize: 14, color: '#6b7280', marginRight: 4 },
  score: { fontSize: 52, fontWeight: 800, lineHeight: 1 },
  scoreMax: { fontSize: 18, color: '#9ca3af' },
  section: { display: 'flex', flexDirection: 'column', gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 },
  greenItem: { fontSize: 14, lineHeight: 1.5, paddingLeft: 4, color: '#166534' },
  yellowItem: { fontSize: 14, lineHeight: 1.5, paddingLeft: 4, color: '#92400e' },
  saveBtn: { alignSelf: 'flex-start', padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#1a1a1a', color: '#fff', fontWeight: 600, fontSize: 14 },
}
