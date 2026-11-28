'use client'

import { useEffect } from 'react'
import { ShellSkeleton } from './ShellSkeleton'
import { buildBffLoginUrl } from '../lib/authRedirect'
import { replaceLocation } from '../lib/navigation'

interface BffLoginRedirectProps {
  targetLinkUri: string
}

export const BffLoginRedirect = ({ targetLinkUri }: BffLoginRedirectProps) => {
  const loginUrl = buildBffLoginUrl(targetLinkUri)

  useEffect(() => {
    replaceLocation(loginUrl)
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
