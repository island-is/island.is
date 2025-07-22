import { Browser, BrowserContext, expect, Page } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { cognitoLogin, idsLogin } from './login'
import { JUDICIAL_SYSTEM_HOME_URL, urls } from './urls'
import { debug } from './utils'

export const sessionsPath = join(__dirname, 'tmp-sessions')
if (!existsSync(sessionsPath)) {
  mkdirSync(sessionsPath, { recursive: true })
}

/**
 * Checks if Cognito authentication is needed (Dev and Staging) and performs the authentication when necessary
 * @param page
 * @param homeUrl
 * @param authUrlPrefix
 */
async function ensureCognitoSessionIfNeeded(
  page: Page,
  homeUrl = '/',
  authUrlPrefix = '',
) {
  const cognitoSessionValidation = await page.request.get(homeUrl)
  if (
    cognitoSessionValidation
      .url()
      .startsWith('https://cognito.shared.devland.is/') ||
    cognitoSessionValidation
      .url()
      .startsWith('https://ids-users.auth.eu-west-1.amazoncognito.com/')
  ) {
    await page.goto(homeUrl)
    await cognitoLogin(page, homeUrl, authUrlPrefix)
  } else {
    debug(`Cognito session exists`)
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
 * @param delegation - National ID of delegation to choose, if any
 */
async function ensureIDSsession(
  idsLoginOn: { nextAuth?: { nextAuthRoot: string } } | boolean,
  page: Page,
  context: BrowserContext,
  homeUrl: string,
  phoneNumber: string,
  authUrlPrefix: string,
  delegation?: string,
  authTrigger: ((page: Page) => Promise<string>) | string = homeUrl,
) {
  if (typeof idsLoginOn === 'object' && idsLoginOn.nextAuth) {
    const idsSessionValidation = await page.request.get(
      `${idsLoginOn.nextAuth.nextAuthRoot}/api/auth/session`,
    )
    const sessionObject = await idsSessionValidation.json()
    if (!sessionObject.expires) {
      const idsPage = await context.newPage()
      if (typeof authTrigger === 'string') await idsPage.goto(authTrigger)
      else authTrigger = await authTrigger(idsPage)
      await idsLogin(idsPage, phoneNumber, authTrigger, delegation)
      await idsPage.close()
    } else {
      debug(`IDS(next-auth) session exists`)
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
    if (sessionObject.status === 'No Session' || sessionObject.isExpired) {
      const idsPage = await context.newPage()
      if (typeof authTrigger === 'string') await idsPage.goto(authTrigger)
      else authTrigger = await authTrigger(idsPage)
      await idsLogin(idsPage, phoneNumber, authTrigger, delegation)
      await idsPage.close()
    } else {
      debug(`IDS session exists`)
    }
  }
}

export async function session({
  browser,
  homeUrl = '/',
  phoneNumber = '',
  authUrl = urls.authUrl,
  idsLoginOn = true,
  delegation = '',
  storageState = `playwright-sessions-${homeUrl}-${phoneNumber}`,
  authTrigger = homeUrl,
}: {
  browser: Browser
  homeUrl?: string
  phoneNumber?: string
  authUrl?: string
  idsLoginOn?:
    | boolean
    | {
        nextAuth?: {
          nextAuthRoot: string
        }
      }
  delegation?: string
  storageState?: string
  authTrigger?: string | ((page: Page) => Promise<string>)
}) {
  // Browser context storage
  // default: sessions/phone x delegation/url
  const storageStatePath = join(
    sessionsPath,
    storageState ??
      `sessions/${phoneNumber}x${delegation ?? phoneNumber}/${homeUrl}`,
  )
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
      delegation,
      authTrigger,
    )
  }
  await page.close()
  const sessionValidationPage = await context.newPage()
  const sessionValidation = await sessionValidationPage.goto(homeUrl, {
    waitUntil: 'domcontentloaded',
  })
  await expect(sessionValidation?.url()).toMatch(homeUrl)
  await sessionValidationPage.context().storageState({ path: storageStatePath })
  await sessionValidationPage.close()
  return context
}

export async function judicialSystemSession({
  browser,
  homeUrl,
}: {
  browser: Browser
  homeUrl?: string
}) {
  const context = await browser.newContext()
  const page = await context.newPage()
  const authUrlPrefix = urls.authUrl
  await ensureCognitoSessionIfNeeded(
    page,
    homeUrl ?? JUDICIAL_SYSTEM_HOME_URL,
    authUrlPrefix,
  )
  await page.close()
  return context
}
