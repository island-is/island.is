import { Browser, expect } from '@playwright/test'
import { existsSync } from 'fs'
import { cognitoLogin, getCognitoCredentials, idsLogin, urls } from './utils'

export async function session({
  browser,
  storageState,
  homeUrl,
  phoneNumber,
  authUrl,
  idsLoginOn,
}: {
  browser: Browser
  storageState: string
  homeUrl: string
  phoneNumber: string
  idsLoginOn:
    | boolean
    | {
        authNext?: {
          authNextRoot: string
        }
      }
  authUrl?: string
}) {
  const context = existsSync(storageState)
    ? await browser.newContext({ storageState: storageState })
    : await browser.newContext()
  const page = await context.newPage()
  const cognitoSessionValidation = await page.request.get(homeUrl)
  const authUrlPrefix = authUrl ?? urls.authUrl
  if (
    cognitoSessionValidation
      .url()
      .startsWith('https://cognito.shared.devland.is/')
  ) {
    await page.goto(homeUrl)
    await cognitoLogin(page, getCognitoCredentials(), homeUrl, authUrlPrefix)
  } else {
    console.log(`Cognito session exists`)
  }
  if (idsLoginOn) {
    if (typeof idsLoginOn === 'object' && idsLoginOn.authNext) {
      const idsSessionValidation = await page.request.get(
        `${idsLoginOn.authNext.authNextRoot}/api/auth/session`,
      )
      const sessionObject = await idsSessionValidation.json()
      if (!sessionObject.expires) {
        const idsPage = await context.newPage()
        await idsPage.goto(homeUrl)
        await idsLogin(idsPage, phoneNumber, homeUrl)
        await idsPage.close()
      } else {
        console.log(`IDS(next-auth) session exists`)
      }
    } else {
      const idsSessionValidation = await page.request.get(
        `${authUrlPrefix}/connect/sessioninfo`,
      )
      const sessionHTML = await idsSessionValidation.text()
      const sessionMatch = sessionHTML.match(/({.*?})/)
      if (!sessionMatch || sessionMatch.length !== 2) {
        throw new Error(
          `IDS session html code has changed. Please review regex for extracting the session info.`,
        )
      }
      const sessionObject = JSON.parse(sessionMatch[1])
      if (
        sessionObject.status === 'No Session' ||
        sessionObject.expiresIn < 5 * 60
      ) {
        const idsPage = await context.newPage()
        await idsPage.goto(homeUrl)
        await idsLogin(idsPage, phoneNumber, homeUrl)
        await idsPage.close()
      } else {
        console.log(`IDS session exists`)
      }
    }
  }
  await page.close()
  const finalPage = await context.newPage()
  const sessionValidation = await finalPage.goto(homeUrl)
  await finalPage.waitForLoadState('networkidle')
  await expect(sessionValidation!.url()).toMatch(homeUrl)
  await finalPage.context().storageState({ path: storageState })
  await finalPage.close()
  return context
}
