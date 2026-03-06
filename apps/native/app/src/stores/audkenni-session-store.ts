import create, { State } from 'zustand/vanilla'
import createUse from 'zustand'

interface AudkenniSession {
  sessionId: string
  sessionSecretDigest: string // Stored by backend, not exposed to app
  createdAt: number
}

interface AudkenniSessionStore extends State {
  pendingSessions: Map<string, AudkenniSession>
  addSession: (sessionId: string) => void
  removeSession: (sessionId: string) => void
  getSession: (sessionId: string) => AudkenniSession | undefined
}

export const audkenniSessionStore = create<AudkenniSessionStore>(
  (set, get) => ({
    pendingSessions: new Map(),
    addSession: (sessionId: string) => {
      set((state) => {
        const newSessions = new Map(state.pendingSessions)
        newSessions.set(sessionId, {
          sessionId,
          sessionSecretDigest: '', // Backend handles this
          createdAt: Date.now(),
        })
        return { pendingSessions: newSessions }
      })
    },
    removeSession: (sessionId: string) => {
      set((state) => {
        const newSessions = new Map(state.pendingSessions)
        newSessions.delete(sessionId)
        return { pendingSessions: newSessions }
      })
    },
    getSession: (sessionId: string) => {
      return get().pendingSessions.get(sessionId)
    },
  }),
)

export const useAudkenniSessionStore = createUse(audkenniSessionStore)
