import { getAuthSettings } from '../userManager'

export interface SessionInfo {
  // Message detailing if the request was processed OK, no session detected or with failure.
  message: string

  // The time when the authenticated session expires.
  expiresUtc?: Date

  // Boolean flag to indicated if the Expires time is passed.
  isExpired?: boolean
}

interface CheckIdpSessionOptions {
  signIn: () => Promise<void>
}

export const checkIdpSession = async ({ signIn }: CheckIdpSessionOptions) => {
  const authSettings = getAuthSettings()

  const res = await fetch(
    `${authSettings.authority}${authSettings.checkSessionPath}`,
  )

  if (res.status === 200) {
    const sessionInfo = (await res.json()) as SessionInfo

    if (sessionInfo.isExpired || sessionInfo.message === 'No user session') {
      // If we are checking the status and recieve expired session we want to redirect to sign in page
      return await signIn()
    }

    if (sessionInfo.expiresUtc) {
      // Start timeout based on expiresUtc to check again if session is expired
      const timeout =
        sessionInfo.expiresUtc.getMilliseconds() - new Date().getMilliseconds()

      setTimeout(async () => {
        await checkIdpSession({ signIn })
      }, timeout)
    }
  } else {
    // Failure to get session info
    await signIn()
  }
}
