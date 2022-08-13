import addSeconds from 'date-fns/addSeconds'
import { useCallback, useEffect, useReducer, useRef } from 'react'

import { getAuthSettings, getUserManager } from '../userManager'

const SessionInfoMessageType = 'SessionInfo'

interface SessionInfo {
  // Type to use to filter postMessage messages
  type: typeof SessionInfoMessageType

  // Message detailing if the request was processed OK, no session detected or with failure.
  message: string

  // The time when the authenticated session expires.
  expiresUtc?: string

  // Number of seconds until the session expires.
  expiresIn?: number

  // Boolean flag to indicated if the Expires time is passed.
  isExpired?: boolean
}

interface UserSession {
  /* Flag to indicate if we have received session info message from the IDS iframe. */
  hasMessage: boolean

  /* The expected time when the user session is ending. */
  sessionEnd: Date | null

  /* The handle of the setInterval function. If set this indicates the user session active state. */
  intervalHandle: ReturnType<typeof setInterval> | null

  /* Number of times we have tried to load the iframe to receive a new session info message. */
  retryCount: number
}

const MAX_RETRIES = 2
const MESSAGE_EVENT_NAME = 'message'
const ACTIVE_SESSION_DELAY = 5 * 1000
const CHECK_SESSION_INTERVAL = 2 * 1000

const EMPTY_SESSION: UserSession = {
  retryCount: 0,
  sessionEnd: null,
  hasMessage: false,
  intervalHandle: null,
}

export const CheckIdpSession = () => {
  const userManager = getUserManager()
  const authSettings = getAuthSettings()
  const iframeSrc = `${authSettings.authority}${authSettings.checkSessionPath}`
  const [iframeId, reloadIframe] = useReducer((id) => id + 1, 0)
  const userSession = useRef<UserSession>({ ...EMPTY_SESSION })

  const isActive = useCallback(() => {
    return !!userSession.current.intervalHandle
  }, [])

  const resetUserSession = useCallback(() => {
    if (userSession.current.intervalHandle) {
      clearInterval(userSession.current.intervalHandle)
    }
    userSession.current.intervalHandle = null
    userSession.current.hasMessage = false
    userSession.current.retryCount = 0
    // Intentionally not resetting sessionEnd as it
    // indicates that the user has had session before.
  }, [])

  const signInRedirect = useCallback(async () => {
    await userManager.removeUser()
    return window.location.reload()
  }, [userManager])

  const checkActiveSession = useCallback(() => {
    setTimeout(() => {
      const hasBeenActive = !!userSession.current.sessionEnd
      const { retryCount, hasMessage } = userSession.current

      if (!isActive() && retryCount > MAX_RETRIES && hasBeenActive) {
        window.location.reload()
      } else if (!hasMessage && retryCount < MAX_RETRIES) {
        userSession.current.retryCount += 1
        reloadIframe()
      }
    }, ACTIVE_SESSION_DELAY)
  }, [isActive])

  const messageHandler = useCallback(
    async ({ data, origin }: MessageEvent): Promise<void> => {
      const sessionInfo = data as SessionInfo

      // Check if the postMessage is meant for us
      if (
        origin !== authSettings.authority ||
        sessionInfo.type !== SessionInfoMessageType
      ) {
        return
      }

      if (sessionInfo && sessionInfo.message === 'OK') {
        userSession.current.hasMessage = true

        // SessionInfo was found, check if it is valid or expired
        if (sessionInfo.isExpired) {
          return signInRedirect()
        } else if (!isActive() && sessionInfo.expiresIn !== undefined) {
          userSession.current.sessionEnd = addSeconds(
            new Date(),
            sessionInfo.expiresIn,
          )

          userSession.current.intervalHandle = setInterval(() => {
            const now = new Date()

            if (
              userSession.current.sessionEnd &&
              now > userSession.current.sessionEnd
            ) {
              resetUserSession()
              reloadIframe()
            }
          }, CHECK_SESSION_INTERVAL)
        }
      } else if (sessionInfo && sessionInfo.message === 'No user session') {
        return signInRedirect()
      }

      // Silent failure as we have failed to get sessionInfo but the user still might have valid session.
      // So we only trigger the signInRedirect flow when we get definite response about expired session.
    },
    [authSettings.authority, signInRedirect, isActive, resetUserSession],
  )

  useEffect(() => {
    window.addEventListener(MESSAGE_EVENT_NAME, messageHandler)

    return () => {
      window.removeEventListener(MESSAGE_EVENT_NAME, messageHandler)
    }
  }, [messageHandler])

  return (
    <iframe
      // We use the key attribute to trigger new reload of the iframe
      key={iframeId}
      title="Check IDP session"
      id="check-idp-session"
      src={iframeSrc}
      width={0}
      height={0}
      style={{ display: 'none' }}
      onLoad={checkActiveSession}
    />
  )
}
