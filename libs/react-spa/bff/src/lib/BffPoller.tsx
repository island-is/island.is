import { usePolling } from '@island.is/react-spa/shared'
import { BffUser } from '@island.is/shared/types'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import {
  BffBroadcastEvents,
  useAuth,
  useBffBroadcaster,
  useUserInfo,
} from './bff.hooks'
import type { SessionExpiredReason } from '@island.is/shared/types'
import { isNewUser } from './bff.utils'

class SessionExpiredError extends Error {
  constructor() {
    super('Session expired')
    this.name = 'SessionExpiredError'
  }
}

type BffPollerProps = {
  children: ReactNode
  newSessionCb(reason: SessionExpiredReason): void
  pollIntervalMS?: number
}

/**
 * BffPoller component continuously polls the user's session
 * information from the backend and broadcasts session changes across tabs
 * or windows using the BroadcastChannel API. It checks for changes in the
 * user's session data and triggers appropriate actions like displaying a
 * session expired modal when necessary.
 *
 * Features:
 * - Polls the backend at a specified interval to fetch user session data.
 * - If the user's session expires (401/403 from the user endpoint), it
 *   displays a session expired modal.
 * - If a change in user session (e.g., a new session ID) is detected, it
 *   broadcasts a message to all open tabs/windows and triggers the provided
 *   `newSessionCb` callback to handle the current tab/window.
 *
 * @param newSessionCb - Callback function to be called when a new session is detected or session expires.
 * @param pollIntervalMS - Polling interval in milliseconds. Default is 10000ms.
 *
 * @usage:
 * Wrap your application's root component with BffPoller to continuously
 * monitor the user's session and keep session state synchronized across
 * multiple tabs/windows.
 */
export const BffPoller = ({
  children,
  newSessionCb,
  pollIntervalMS = 10000,
}: BffPollerProps) => {
  const { bffUrlGenerator } = useAuth()
  const userInfo = useUserInfo()
  const { postMessage } = useBffBroadcaster()
  const bffBaseUrl = bffUrlGenerator()

  const url = useMemo(
    () =>
      bffUrlGenerator('/user', {
        refresh: 'false',
      }),
    [bffUrlGenerator],
  )

  const fetchUser = useCallback(async () => {
    const res = await fetch(url, {
      credentials: 'include',
    })

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new SessionExpiredError()
      }
      throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    }

    return res.json() as Promise<BffUser>
  }, [url])

  // Poll user data every 10 seconds
  const { data: newUser, error } = usePolling({
    fetcher: fetchUser,
    intervalMs: pollIntervalMS,
    waitToStartMS: 5000,
  })

  useEffect(() => {
    if (error instanceof SessionExpiredError) {
      newSessionCb('expired')
    } else if (newUser) {
      // If user has changed (e.g. delegation switch), then notifiy tabs/windows/iframes and execute the callback.
      if (isNewUser(newUser, userInfo)) {
        // Note! The tab, window, or iframe that sends this message will not receive it.
        // This is because the BroadcastChannel API does not broadcast messages to the sender.
        // Therefore we need to manually handle the new session in the current tab/window, by calling the newSessionCb().
        postMessage({
          type: BffBroadcastEvents.NEW_SESSION,
          userInfo: newUser,
          bffBaseUrl,
        })

        newSessionCb('session-changed')
      }
    }
  }, [newUser, error, userInfo, postMessage, newSessionCb, bffBaseUrl])

  return children
}
