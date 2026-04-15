'use client'

import { useEffect } from 'react'
import { ShellSkeleton } from './ShellSkeleton'
import { buildBffLoginUrl } from '../lib/authRedirect'

interface BffLoginRedirectProps {
  targetLinkUri: string
}

export function BffLoginRedirect({
  targetLinkUri,
}: BffLoginRedirectProps) {
  const loginUrl = buildBffLoginUrl(targetLinkUri)

  useEffect(() => {
    window.location.replace(loginUrl)
  }, [loginUrl])

  return (
    <main>
      <ShellSkeleton />
      <p style={{ padding: '1rem 2rem' }}>
        Redirecting to sign in. If nothing happens,{' '}
        <a href={loginUrl}>continue manually</a>.
      </p>
    </main>
  )
}
