import { useEffect } from 'react'

type Key = KeyboardEvent['key'] | KeyboardEvent['key'][]

export const useKeyDown = (key: Key, cb: () => void) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (Array.isArray(key)) {
        if (key.includes(e.key)) {
          cb()
        }
      } else {
        if (e.key === key.toString()) {
          cb()
        }
      }
    }
    window.addEventListener('keydown', (e) => handler(e))
    return () => window.removeEventListener('keydown', (e) => handler(e))
  }, [])
}
