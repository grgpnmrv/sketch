const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface Task {
  id: number
  title: string
  description: string
  difficulty: string
}

export interface Feedback {
  score: number
  green: string[]
  yellow: string[]
}

export interface SketchRecord {
  id: number
  task_id: number | null
  image_url: string
  score: number
  feedback_json: { green: string[]; yellow: string[] }
  created_at: string
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE}/tasks`)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function uploadSketch(imageBlob: Blob, taskId: number | null): Promise<Feedback> {
  const form = new FormData()
  form.append('image', imageBlob, 'sketch.jpg')
  if (taskId !== null) form.append('task_id', String(taskId))

  const res = await fetch(`${BASE}/sketches/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? 'Upload failed')
  }
  return res.json()
}

export async function fetchHistory(): Promise<SketchRecord[]> {
  const res = await fetch(`${BASE}/sketches/history`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function register(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? 'Registration failed')
  }
  const data = await res.json()
  return data.access_token
}

export async function login(email: string, password: string): Promise<string> {
  const form = new URLSearchParams({ username: email, password })
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? 'Login failed')
  }
  const data = await res.json()
  return data.access_token
}
