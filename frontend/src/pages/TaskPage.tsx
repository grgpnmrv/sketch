import { useState } from 'react'
import { Link } from 'react-router-dom'
import Timer from '../components/Timer'
import TaskSelector from '../components/TaskSelector'
import ReferenceImage from '../components/ReferenceImage'
import ImageUpload from '../components/ImageUpload'
import FeedbackPanel from '../components/FeedbackPanel'
import AuthPage from './AuthPage'
import { uploadSketch, type Task, type Feedback } from '../api'
import { useAppStore } from '../store'

type Step = 'setup' | 'drawing' | 'uploading' | 'done'

export default function TaskPage() {
  const [step, setStep] = useState<Step>('setup')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [sketchBlob, setSketchBlob] = useState<Blob | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [error, setError] = useState('')
  const [showAuth, setShowAuth] = useState(false)
  const token = useAppStore((s) => s.token)
  const logout = useAppStore((s) => s.logout)

  const handleUpload = async () => {
    if (!sketchBlob) return
    setStep('uploading')
    setError('')
    try {
      const fb = await uploadSketch(sketchBlob, selectedTask?.id ?? null)
      setFeedback(fb)
      setStep('done')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
      setStep('drawing')
    }
  }

  const handleSave = () => {
    if (!token) {
      setShowAuth(true)
    }
    // If already logged in, sketch was saved automatically on upload
  }

  const reset = () => {
    setStep('setup')
    setSketchBlob(null)
    setFeedback(null)
    setError('')
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.logo}>✏️ Sketch</span>
        <div style={styles.navRight}>
          {token ? (
            <>
              <Link to="/history" style={styles.navLink}>History</Link>
              <button style={styles.navBtn} onClick={logout}>Sign out</button>
            </>
          ) : (
            <button style={styles.navBtn} onClick={() => setShowAuth(true)}>Sign in</button>
          )}
        </div>
      </nav>

      {step === 'setup' && (
        <div style={styles.section}>
          <h1 style={styles.heading}>What will you draw today?</h1>
          <TaskSelector value={selectedTask} onChange={setSelectedTask} />
          <ReferenceImage />
          <button style={styles.primary} onClick={() => setStep('drawing')}>
            Start drawing →
          </button>
        </div>
      )}

      {(step === 'drawing' || step === 'uploading') && (
        <div style={styles.section}>
          <div style={styles.timerRow}>
            <Timer />
          </div>
          {selectedTask && (
            <div style={styles.taskBox}>
              <strong>{selectedTask.title}</strong>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{selectedTask.description}</p>
            </div>
          )}
          <h2 style={styles.subheading}>Upload your sketch when ready</h2>
          <ImageUpload onReady={(blob) => setSketchBlob(blob)} />
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.row}>
            <button style={styles.ghost} onClick={reset}>← Back</button>
            <button
              style={{ ...styles.primary, opacity: sketchBlob && step !== 'uploading' ? 1 : 0.5 }}
              disabled={!sketchBlob || step === 'uploading'}
              onClick={handleUpload}
            >
              {step === 'uploading' ? 'Getting feedback…' : 'Get feedback →'}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && feedback && (
        <div style={styles.section}>
          <h1 style={styles.heading}>Your feedback</h1>
          <FeedbackPanel
            feedback={feedback}
            onSave={!token ? handleSave : undefined}
          />
          {token && <p style={{ fontSize: 13, color: '#6b7280' }}>Sketch saved to your history.</p>}
          <button style={styles.ghost} onClick={reset}>Draw again</button>
        </div>
      )}

      {showAuth && (
        <AuthPage
          onSuccess={() => setShowAuth(false)}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #e5e7eb' },
  logo: { fontSize: 18, fontWeight: 700 },
  navRight: { display: 'flex', gap: 12, alignItems: 'center' },
  navLink: { fontSize: 14, color: '#1a1a1a', fontWeight: 600, textDecoration: 'none' },
  navBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  section: { maxWidth: 560, width: '100%', margin: '0 auto', padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 20 },
  heading: { fontSize: 26, fontWeight: 800 },
  subheading: { fontSize: 16, fontWeight: 600 },
  timerRow: { display: 'flex', justifyContent: 'center' },
  taskBox: { background: '#f9fafb', borderRadius: 8, padding: 14, border: '1px solid #e5e7eb' },
  primary: { padding: '12px 24px', borderRadius: 8, border: 'none', background: '#1a1a1a', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', alignSelf: 'flex-start' },
  ghost: { padding: '10px 20px', borderRadius: 8, border: '1.5px solid #d1d5db', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', alignSelf: 'flex-start' },
  row: { display: 'flex', gap: 12, alignItems: 'center' },
  error: { color: '#dc2626', fontSize: 13 },
}
