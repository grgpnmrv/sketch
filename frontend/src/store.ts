import { create } from 'zustand'

interface AppState {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  token: localStorage.getItem('token'),
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null })
  },
}))
