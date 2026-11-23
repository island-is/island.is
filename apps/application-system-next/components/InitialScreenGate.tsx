'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { fetchScreen, GraphqlHttpError, type SdfScreen } from '../lib/graphql'
import { getHistoryAction, writeScreenHistory } from '../lib/screenNavigation'
import { ApplicationShell } from './ApplicationShell'
import { BffLoginRedirect } from './BffLoginRedirect'
import { ShellSkeleton } from './ShellSkeleton'

interface InitialScreenGateProps {
  applicationId: string
  screen?: string
}

export const InitialScreenGate = ({
  applicationId,
  screen: requestedScreenId,
}: InitialScreenGateProps) => {
  const [screen, setScreen] = useState<SdfScreen | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loginTarget, setLoginTarget] = useState<string | null>(null)

  // Seed the first fetch with the locale known at mount so there is no Icelandic
  // flash when the user's preferred language is already resolved. Captured in a
  // ref (not an effect dep) so a later language switch is handled in place by
  // `useFormActions` rather than remounting the whole shell here.
  const { lang } = useLocale()
  const initialLangRef = useRef(lang)

  useEffect(() => {
    let isActive = true

    fetchScreen(applicationId, requestedScreenId, initialLangRef.current)
      .then((nextScreen) => {
        if (!isActive) {
          return
        }

        // Make the address bar name the screen shown (the link may have had no
        // screen, or one the server replaced), so every history entry has one.
        const historyAction = getHistoryAction({
          source: 'url',
          requestedId: requestedScreenId,
          responseId: nextScreen.page.id,
        })
        if (historyAction !== 'none') {
          writeScreenHistory(historyAction, nextScreen.page.id)
        }

        setScreen(nextScreen)
        setError(null)
      })
      .catch((nextError) => {
        if (!isActive) {
          return
        }

        if (
          nextError instanceof GraphqlHttpError &&
          nextError.status === 401 &&
          typeof window !== 'undefined'
        ) {
          setLoginTarget(window.location.href)
          return
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Failed to load application',
        )
      })

    return () => {
      isActive = false
    }
  }, [applicationId, requestedScreenId])

  if (loginTarget) {
    return <BffLoginRedirect targetLinkUri={loginTarget} />
  }

  if (!screen) {
    return (
      <main>
        <ShellSkeleton />
        {error && (
          <p style={{ padding: '1rem 2rem', color: '#B30038' }}>{error}</p>
        )}
      </main>
    )
  }

  return (
    <ApplicationShell applicationId={applicationId} initialScreen={screen} />
  )
}
