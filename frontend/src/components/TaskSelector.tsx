import { useEffect, useState } from 'react'
import { fetchTasks, type Task } from '../api'

interface Props {
  value: Task | null
  onChange: (task: Task | null) => void
}

export default function TaskSelector({ value, onChange }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#6b7280' }}>Loading tasks…</p>

  return (
    <div style={styles.wrap}>
      <label style={styles.label}>Choose a task</label>
      <select
        style={styles.select}
        value={value?.id ?? ''}
        onChange={(e) => {
          const found = tasks.find((t) => t.id === Number(e.target.value)) ?? null
          onChange(found)
        }}
      >
        <option value="">— Free draw —</option>
        {tasks.map((t) => (
          <option key={t.id} value={t.id}>
            [{t.difficulty}] {t.title}
          </option>
        ))}
      </select>
      {value && (
        <p style={styles.desc}>{value.description}</p>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontWeight: 600, fontSize: 14 },
  select: { padding: '8px 12px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14, background: '#fff' },
  desc: { fontSize: 13, color: '#6b7280', lineHeight: 1.5, maxWidth: 480 },
}
