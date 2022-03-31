import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react'

import { getAuthSettings, getUserManager } from '../userManager'
import { ActionType, initialState, reducer } from './Authenticator.state'

export interface SessionInfo {
  // Message detailing if the request was processed OK, no session detected or with failure.
  message: string

  // The time when the authenticated session expires.
  expiresUtc?: string

  // Boolean flag to indicated if the Expires time is passed.
  isExpired?: boolean
}

interface SessionInfoMessage {
  type: 'SessionInfo'
}

const messageEventName = 'message'

export const CheckIdpSession = () => {
  const reducerInstance = useReducer(reducer, initialState)
  const [state, dispatch] = reducerInstance
  const userManager = getUserManager()
  const authSettings = getAuthSettings()
  const iframeSrc = `${authSettings.authority}${authSettings.checkSessionPath}`
  const [iframeChecksum, setIframeChecksum] = useState(0)
  const [sessionTimeout, setSessionTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  const signOut = useCallback(
    async function signOut() {
      dispatch({
        type: ActionType.LOGGING_OUT,
      })
      await userManager.signoutRedirect({
        post_logout_redirect_uri: authSettings.baseUrl,
      })
    },
    [userManager, dispatch, authSettings.baseUrl],
  )

  const onLoadHandler = (event: SyntheticEvent<HTMLIFrameElement>) => {
    if (authSettings.authority) {
      event?.currentTarget?.contentWindow?.postMessage(
        { type: 'SessionInfo' } as SessionInfoMessage,
        authSettings.authority,
      )
    }
  }

  const checkIdpSessionIframe = (
    <iframe
      // We use the key attribute to trigger new reload of the iframe
      key={iframeChecksum}
      title="Check IDP session"
      id="check-idp-session"
      src={iframeSrc}
      width={0}
      height={0}
      style={{ display: 'none' }}
      onLoad={onLoadHandler}
    />
  )

  const messageHandler = useCallback(
    async ({ data, origin }: MessageEvent): Promise<void> => {
      if (origin !== authSettings.authority) {
        return
      }

      const sessionInfo = data as SessionInfo

      if (sessionInfo && sessionInfo.message === 'OK') {
        // SessionInfo was found, check if it is valid or expired
        if (sessionInfo.isExpired) {
          return signOut()
        } else if (sessionInfo.expiresUtc) {
          // Calculate when the session should expire with padding when we should check again
          const timeout =
            new Date(sessionInfo.expiresUtc).getTime() -
            new Date().getTime() +
            1000

          if (timeout <= 0) {
            // The session is expired but for some reason the `isExpired` was not correctly set
            return signOut()
          }

          if (!sessionTimeout) {
            const newSessionTimeout = setTimeout(() => {
              setSessionTimeout(null)
              setIframeChecksum((i) => i + 1)
            }, timeout)
            setSessionTimeout(newSessionTimeout)
          }
        }
      } else if (sessionInfo && sessionInfo.message === 'No user session') {
        return signOut()
      }

      // Silent failure as we have failed to get sessionInfo but the user still might have valid session.
      // So we only trigger the signIn flow when we get definite response about expired session.
    },
    [authSettings.authority, signOut, sessionTimeout],
  )

  useEffect(() => {
    window.addEventListener(messageEventName, messageHandler)

    return () => {
      window.removeEventListener(messageEventName, messageHandler)
    }
  }, [messageHandler, iframeChecksum])

  return checkIdpSessionIframe
}
