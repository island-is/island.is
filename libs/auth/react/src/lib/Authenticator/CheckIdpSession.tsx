import type { History } from 'history'
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'

import { AuthSettings } from '../AuthSettings'
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

const getReturnUrl = (history: History, { redirectPath }: AuthSettings) => {
  const returnUrl = history.location.pathname + history.location.search
  if (redirectPath && returnUrl.startsWith(redirectPath)) {
    return '/'
  }
  return returnUrl
}

export const CheckIdpSession = () => {
  const history = useHistory()
  const reducerInstance = useReducer(reducer, initialState)
  const [state, dispatch] = reducerInstance
  const userManager = getUserManager()
  const authSettings = getAuthSettings()
  const iframeSrc = `${authSettings.authority}${authSettings.checkSessionPath}`
  const [iframeChecksum, setIframeChecksum] = useState(0)

  let sessionTimeout: ReturnType<typeof setTimeout> | null = null

  const signIn = useCallback(
    async function signIn() {
      dispatch({
        type: ActionType.SIGNIN_START,
      })
      return userManager.signinRedirect({
        state: getReturnUrl(history, authSettings),
      })
      // Nothing more happens here since browser will redirect to IDS.
    },
    [dispatch, userManager, authSettings, history],
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

  const messageHandler = async ({
    data,
    origin,
  }: MessageEvent): Promise<void> => {
    if (origin !== authSettings.authority) {
      return
    }

    const sessionInfo = data as SessionInfo

    if (sessionInfo && sessionInfo.message === 'OK') {
      // SessionInfo was found, check if it is valid or expired
      if (sessionInfo.isExpired) {
        return signIn()
      } else if (sessionInfo.expiresUtc) {
        // Calculate when the session should expire with padding when we should check again
        const timeout =
          new Date(sessionInfo.expiresUtc).getTime() -
          new Date().getTime() +
          1000

        if (timeout <= 0) {
          // The session is expired but for some reason the `isExpired` was not correctly set
          return signIn()
        }

        if (!sessionTimeout) {
          sessionTimeout = setTimeout(() => {
            sessionTimeout = null
            window.removeEventListener(messageEventName, messageHandler)
            setIframeChecksum(iframeChecksum + 1)
          }, timeout)
        }
      }
    } else if (sessionInfo && sessionInfo.message === 'No user session') {
      return signIn()
    }

    // Silent failure as we have failed to get sessionInfo but the user still might have valid session.
    // So we only trigger the signIn flow when we get definite response about expired session.
  }

  useEffect(() => {
    window.addEventListener(messageEventName, messageHandler)

    return () => window.removeEventListener(messageEventName, messageHandler)
  }, [])

  return checkIdpSessionIframe
}
