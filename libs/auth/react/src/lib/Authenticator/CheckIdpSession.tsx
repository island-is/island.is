import addSeconds from 'date-fns/addSeconds'
import { useCallback, useEffect, useReducer, useRef } from 'react'

import { getAuthSettings, getUserManager } from '../userManager'

const UserSessionMessageType = 'SessionInfo'

interface UserSessionMessage {
  // Type to use to filter postMessage messages
  type: typeof UserSessionMessageType

  // Status of the message received from IDP.
  status: 'Ok' | 'No Session' | 'Failure'

  // The time when the authenticated session expires.
  expiresUtc?: string

  // Number of seconds until the session expires.
  expiresIn?: number

  // Boolean flag to indicated if the Expires time is passed.
  isExpired?: boolean
}

interface UserSessionState {
  /* The expected time when the user session is ending. */
  sessionEnd: Date | null

  /**
   * An interval function that checks if the expected sessionEnd has passed.
   * When set this indicates that the user has an active session.
   */
  intervalHandle: ReturnType<typeof setInterval> | null

  /* The number of times we have tried to load the iframe to receive a new session info message. */
  retryCount: number
}

const MAX_RETRIES = 2
const ACTIVE_SESSION_DELAY = 5 * 1000
const CHECK_SESSION_INTERVAL = 2 * 1000

const EMPTY_SESSION: UserSessionState = {
  retryCount: 0,
  sessionEnd: null,
  intervalHandle: null,
}

/**
 * This component monitors if the user session is active on the Identity Provider (IDP).
 * When it detects that the user session is expired it redirects to the sign in page on the IDP.
 *
 * It loads a script from the IDP's 'connect/sessioninfo' endpoint into an iframe.
 * The script uses the postMessage API to post UserSessionMessage, which contains
 * details if the session is expired or after how many seconds it will expire.
 * We use these details to register a interval to monitor the session expiration.
 */
export const CheckIdpSession = () => {
  const userManager = getUserManager()
  const authSettings = getAuthSettings()
  const iframeSrc = `${authSettings.authority}${authSettings.checkSessionPath}`
  const [iframeId, reloadIframe] = useReducer((id) => id + 1, 0)
  const userSession = useRef<UserSessionState>({ ...EMPTY_SESSION })

  const isActive = useCallback(() => {
    // When intervalHandle is set it means we have registered
    // a setInterval to monitor an active user session.
    return !!userSession.current.intervalHandle
  }, [])

  const hasBeenActive = useCallback(() => {
    // When sessionEnd is set it means the has been active
    // as we have an earlier UserSessionMessage.
    return !!userSession.current.sessionEnd
  }, [])

  const resetUserSession = useCallback(() => {
    if (userSession.current.intervalHandle) {
      clearInterval(userSession.current.intervalHandle)
    }
    userSession.current.intervalHandle = null
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
      const { retryCount } = userSession.current

      if (!isActive() && retryCount > MAX_RETRIES && hasBeenActive()) {
        // We were unable to retrieve a message from the IDP after max retries and have a reason
        // to believe that the session is expired (an earlier UserSessionMessage has expired).
        // So we reload the window just to be safe. This causes one of three things to happen:
        // - If the iframe is broken and the user does have a valid IDP session, they'll generally reload where they were.
        // - If the iframe is broken and the user does not have a valid IDP session, they're sent to the login page.
        // - If the user has a network problem, then they'll see a browser error screen, but at least any sensitive information is not visible any more.
        window.location.reload()
      } else if (!isActive() && retryCount < MAX_RETRIES) {
        userSession.current.retryCount += 1
        // We are unable to retrieve a message from the IDP,
        // so we reload the iframe to retry without reloading the window.
        reloadIframe()
      }
    }, ACTIVE_SESSION_DELAY)
  }, [isActive, hasBeenActive])

  const messageHandler = useCallback(
    async ({ data, origin }: MessageEvent): Promise<void> => {
      const sessionInfo = data as UserSessionMessage

      // Check if the postMessage is meant for us
      if (
        origin !== authSettings.authority ||
        sessionInfo.type !== UserSessionMessageType
      ) {
        return
      }

      if (sessionInfo && sessionInfo.status === 'Ok') {
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
              // The expected session end has passed but the user might have extended their session.
              // So we reset the session state and reload the iframe to query new session info from the IDP.
              resetUserSession()
              reloadIframe()
            }
          }, CHECK_SESSION_INTERVAL)
        }
      } else if (
        sessionInfo &&
        sessionInfo.status === 'No Session' &&
        hasBeenActive()
      ) {
        return signInRedirect()
      }

      // Silent failure as we have failed to get sessionInfo but the user still might have valid session.
      // So we only trigger the signInRedirect flow when we get definite response about expired session.
    },
    [
      authSettings.authority,
      signInRedirect,
      isActive,
      hasBeenActive,
      resetUserSession,
    ],
  )

  useEffect(() => {
    window.addEventListener('message', messageHandler)

    return () => {
      window.removeEventListener('message', messageHandler)
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
