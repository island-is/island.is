'use client'

import { useEffect, useState } from 'react'
import { buildBffLoginUrl } from '../lib/authRedirect'
import { ShellSkeleton } from './ShellSkeleton'

type AuthState = 'checking' | 'authenticated' | 'redirecting'

export function BffAuthGuard({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('checking')

  useEffect(() => {
    let isActive = true

    fetch('/bff/user?refresh=true', { credentials: 'include' })
      .then((res) => {
        if (!isActive) return

        if (res.ok) {
          setAuthState('authenticated')
        } else if (res.status < 500) {
          setAuthState('redirecting')
          const targetUri = window.location.href
          window.location.replace(buildBffLoginUrl(targetUri))
        } else {
          setAuthState('authenticated')
        }
      })
      .catch(() => {
        if (!isActive) return
        setAuthState('authenticated')
      })

    return () => {
      isActive = false
    }
  }, [])

  if (authState === 'checking' || authState === 'redirecting') {
    return (
      <main>
        <ShellSkeleton />
      </main>
    )
  }

  return <>{children}</>
}
