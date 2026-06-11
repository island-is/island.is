'use client'

import React, { useEffect, useState } from 'react'
import { BffProvider } from '@island.is/react-spa/bff'
import { ShellSkeleton } from './ShellSkeleton'

/**
 * Client wrapper around the shared `BffProvider`. The library component is not
 * marked `'use client'`, so it cannot be rendered directly from the server
 * `layout.tsx`; this wrapper carries the directive and supplies the app config.
 *
 * Replaces the bespoke `BffAuthGuard`: `BffProvider` handles the login check,
 * loading screen, login redirect, and session polling, and additionally exposes
 * the `useAuth`/`useUserInfo` context that the shared `UserMenu` (header user
 * dropdown + locale switcher) depends on.
 *
 * `BffProvider` reads `window.location` during render (not just in effects), so
 * it is not SSR-safe. We therefore only render it after the component has
 * mounted on the client — during SSR/static prerender we emit the same skeleton
 * the old guard showed while checking. Server and client both render the
 * skeleton on first paint, so there is no hydration mismatch.
 *
 * `applicationBasePath` is `/` because the app's routes live at the root
 * (`next.config.js` sets `basePath: ''`). The default BFF global prefix (`/bff`)
 * already matches the existing `/bff/*` endpoints.
 */
export const AppBffProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main>
        <ShellSkeleton />
      </main>
    )
  }

  return <BffProvider applicationBasePath="/">{children}</BffProvider>
}
