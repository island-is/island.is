import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { getAuthSettings, getUserManager } from '../userManager'

enum SessionInfoMessageType {
  SessionInfoRequest = 'SessionInfoRequest',
  SessionInfoReponse = 'SessionInfoResponse',
}

export interface SessionInfoResponse {
  // Type to use to filter postMessage messages
  type: SessionInfoMessageType.SessionInfoReponse

  // Message detailing if the request was processed OK, no session detected or with failure.
  message: string

  // The time when the authenticated session expires.
  expiresUtc?: string

  // Boolean flag to indicated if the Expires time is passed.
  isExpired?: boolean
}

interface SessionInfoRequest {
  type: SessionInfoMessageType.SessionInfoRequest
}

const messageEventName = 'message'

export const CheckIdpSession = () => {
  const userManager = getUserManager()
  const authSettings = getAuthSettings()
  const iframeSrc = `${authSettings.authority}${authSettings.checkSessionPath}`
  const [iframeChecksum, setIframeChecksum] = useState(0)
  const sessionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const signInRedirect = useCallback(async () => {
    await userManager.removeUser()
    return window.location.reload()
  }, [userManager])

  const onLoadHandler = (event: SyntheticEvent<HTMLIFrameElement>) => {
    if (authSettings.authority) {
      event?.currentTarget?.contentWindow?.postMessage(
        {
          type: SessionInfoMessageType.SessionInfoRequest,
        } as SessionInfoRequest,
        authSettings.authority,
      )
    }
  }

  const messageHandler = useCallback(
    async ({ data, origin }: MessageEvent): Promise<void> => {
      const sessionInfo = data as SessionInfoResponse

      if (
        origin !== authSettings.authority ||
        sessionInfo.type !== SessionInfoMessageType.SessionInfoReponse
      ) {
        return
      }

      if (sessionInfo && sessionInfo.message === 'OK') {
        // SessionInfo was found, check if it is valid or expired
        if (sessionInfo.isExpired) {
          return signInRedirect()
        } else if (sessionInfo.expiresUtc) {
          // Calculate when the session should expire with padding when we should check again
          const timeout =
            new Date(sessionInfo.expiresUtc).getTime() -
            new Date().getTime() +
            1000

          if (timeout <= 0) {
            // The session is expired but for some reason the `isExpired` was not correctly set
            return signInRedirect()
          }

          if (!sessionTimeout.current) {
            const newSessionTimeout = setTimeout(() => {
              sessionTimeout.current = null
              setIframeChecksum((i) => i + 1)
            }, timeout)
            sessionTimeout.current = newSessionTimeout
          }
        }
      } else if (sessionInfo && sessionInfo.message === 'No user session') {
        return signInRedirect()
      }

      // Silent failure as we have failed to get sessionInfo but the user still might have valid session.
      // So we only trigger the signInRedirect flow when we get definite response about expired session.
    },
    [authSettings.authority, signInRedirect],
  )

  useEffect(() => {
    window.addEventListener(messageEventName, messageHandler)

    return () => {
      window.removeEventListener(messageEventName, messageHandler)
    }
  }, [messageHandler])

  return (
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
}
