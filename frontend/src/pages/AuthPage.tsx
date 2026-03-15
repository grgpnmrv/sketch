import { useState } from 'react'
import { login, register } from '../api'
import { useAppStore } from '../store'

interface Props {
  onSuccess: () => void
  onClose: () => void
}

export default function AuthPage({ onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setToken = useAppStore((s) => s.setToken)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = mode === 'register'
        ? await register(email, password)
        : await login(email, password)
      setToken(token)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={onClose}>✕</button>
        <h2 style={styles.title}>{mode === 'register' ? 'Create account' : 'Sign in'}</h2>
        <p style={styles.subtitle}>to save your sketches and track progress</p>
        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'register' ? 'Register' : 'Sign in'}
          </button>
        </form>
        <p style={styles.toggle}>
          {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button style={styles.link} onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
            {mode === 'register' ? 'Sign in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 380, position: 'relative' },
  close: { position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b7280' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '10px 14px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14, outline: 'none' },
  error: { fontSize: 13, color: '#dc2626' },
  submit: { padding: '10px', borderRadius: 8, border: 'none', background: '#1a1a1a', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' },
  toggle: { marginTop: 16, fontSize: 13, color: '#6b7280', textAlign: 'center' },
  link: { background: 'none', border: 'none', color: '#1a1a1a', fontWeight: 600, cursor: 'pointer', fontSize: 13 },
}
