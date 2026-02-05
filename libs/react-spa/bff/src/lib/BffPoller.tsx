import { usePolling } from '@island.is/react-spa/shared'
import { BffUser } from '@island.is/shared/types'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import {
  BffBroadcastEvents,
  useAuth,
  useBffBroadcaster,
  useUserInfo,
} from './bff.hooks'
import { isNewUser } from './bff.utils'

type BffPollerProps = {
  children: ReactNode
  newSessionCb(): void
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
 * - If the user's session expires or the backend returns an error, it
 *   displays a session expired modal informing the user and allowing them
 *   to log in again.
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
      // Session expired - show the session expired modal instead of immediately redirecting
      throw new Error('Session expired')
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
    if (error) {
      // If user polling fails, likely due to 401, show session expired modal
      // instead of immediately redirecting to login
      newSessionCb()
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

        newSessionCb()
      }
    }
  }, [newUser, error, userInfo, postMessage, newSessionCb, bffBaseUrl])

  return children
}
