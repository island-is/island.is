import { Browser, BrowserContext, expect, Page } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { cognitoLogin, getCognitoCredentials, idsLogin, urls } from './utils'

const sessionsPath = join(__dirname, 'tmp-sessions')
if (!existsSync(sessionsPath)) {
  mkdirSync(sessionsPath)
}

/**
 * Checks if Cognito authentication is needed (Dev and Staging) and performs the authentication when necessary
 * @param page
 * @param homeUrl
 * @param authUrlPrefix
 */
async function ensureCognitoSessionIfNeeded(
  page: Page,
  homeUrl: string,
  authUrlPrefix: string,
) {
  const cognitoSessionValidation = await page.request.get(homeUrl)
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
}

/**
 * Validates the IDS session and creates a new one if needed. Supports both the standard authentication session as well as NextAuth way.
 * @param idsLoginOn
 * @param page
 * @param context
 * @param homeUrl
 * @param phoneNumber
 * @param authUrlPrefix
 */
async function ensureIDSsession(
  idsLoginOn: { nextAuth?: { nextAuthRoot: string } } | boolean,
  page: Page,
  context: BrowserContext,
  homeUrl: string,
  phoneNumber: string,
  authUrlPrefix: string,
) {
  if (typeof idsLoginOn === 'object' && idsLoginOn.nextAuth) {
    const idsSessionValidation = await page.request.get(
      `${idsLoginOn.nextAuth.nextAuthRoot}/api/auth/session`,
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
        nextAuth?: {
          nextAuthRoot: string
        }
      }
  authUrl?: string
}) {
  const storageStatePath = join(sessionsPath, storageState)
  const context = existsSync(storageStatePath)
    ? await browser.newContext({ storageState: storageStatePath })
    : await browser.newContext()
  const page = await context.newPage()
  const authUrlPrefix = authUrl ?? urls.authUrl
  await ensureCognitoSessionIfNeeded(page, homeUrl, authUrlPrefix)
  if (idsLoginOn) {
    await ensureIDSsession(
      idsLoginOn,
      page,
      context,
      homeUrl,
      phoneNumber,
      authUrlPrefix,
    )
  }
  await page.close()
  const sessionValidationPage = await context.newPage()
  const sessionValidation = await sessionValidationPage.goto(homeUrl, {
    waitUntil: 'networkidle',
  })
  await expect(sessionValidation!.url()).toMatch(homeUrl)
  await sessionValidationPage.context().storageState({ path: storageStatePath })
  await sessionValidationPage.close()
  return context
}
