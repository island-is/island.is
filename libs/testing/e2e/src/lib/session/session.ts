import { Browser, BrowserContext, expect, Page } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { cognitoLogin, idsLogin } from './login'
import { JUDICIAL_SYSTEM_HOME_URL, urls } from '../modules/urls'
import { debug } from '../helpers/utils'

export const sessionsPath = join(__dirname, 'tmp-sessions')
if (!existsSync(sessionsPath)) {
  mkdirSync(sessionsPath, { recursive: true })
}

/**
 * Validates an existing Cognito session by checking the home URL.
 * If not valid, initiates Cognito login.
 *
 * @param page - The Playwright Page object.
 * @param homeUrl - URL of the home page. Defaults to '/'.
 * @param authUrlPrefix - URL prefix for authentication. Defaults to an empty string.
 */
const ensureCognitoSessionIfNeeded = async (
  page: Page,
  homeUrl = '/',
  authUrlPrefix = '',
) => {
  const sessionCheck = await page.request.get(homeUrl)

  if (
    sessionCheck.url().startsWith('https://cognito.shared.devland.is/') ||
    sessionCheck
      .url()
      .startsWith('https://ids-users.auth.eu-west-1.amazoncognito.com/')
  ) {
    await page.goto(homeUrl)
    await cognitoLogin(page, homeUrl, authUrlPrefix)
  } else {
    debug(`Cognito session is active`)
  }
}

/**
 * Validates an IDS session or initiates IDS login if the session is missing or expired.
 *
 * @param idsLoginOn - Either a boolean or an object with IDS config.
 * @param page - The current Playwright Page object.
 * @param context - The Playwright BrowserContext object.
 * @param homeUrl - URL of the home page.
 * @param phoneNumber - Phone number for IDS login.
 * @param authUrlPrefix - Authentication URL prefix.
 * @param delegation - Optional delegation parameter.
 * @param authTrigger - Function or URL to initiate the authentication.
 */
const ensureIDSsession = async (
  idsLoginOn: { nextAuth?: { nextAuthRoot: string } } | boolean,
  page: Page,
  context: BrowserContext,
  homeUrl: string,
  phoneNumber: string,
  authUrlPrefix: string,
  delegation?: string,
  authTrigger: ((page: Page) => Promise<string>) | string = homeUrl,
) => {
  // Handling nextAuth configuration
  if (typeof idsLoginOn === 'object' && idsLoginOn.nextAuth) {
    const sessionCheck = await page.request.get(
      `${idsLoginOn.nextAuth.nextAuthRoot}/api/auth/session`,
    )
    const sessionData = await sessionCheck.json()

    if (!sessionData.expires) {
      const authPage = await context.newPage()
      if (typeof authTrigger === 'string') await authPage.goto(authTrigger)
      else authTrigger = await authTrigger(authPage)
      await idsLogin(authPage, phoneNumber, authTrigger, delegation)
      await authPage.close()
    } else {
      debug(`IDS (next-auth) session is active`)
    }
  } else {
    // Fallback IDS session validation
    const sessionCheck = await page.request.get(
      `${authUrlPrefix}/connect/sessioninfo`,
    )
    const sessionText = await sessionCheck.text()
    const sessionMatch = sessionText.match(/({.*?})/)

    if (!sessionMatch || sessionMatch.length !== 2) {
      throw new Error(
        `IDS session html code has changed. Please review regex for extracting the session info.`,
      )
    }

    const sessionData = JSON.parse(sessionMatch[1])
    if (sessionData.status === 'No Session' || sessionData.isExpired) {
      const authPage = await context.newPage()
      if (typeof authTrigger === 'string') await authPage.goto(authTrigger)
      else authTrigger = await authTrigger(authPage)
      await idsLogin(authPage, phoneNumber, authTrigger, delegation)
      await authPage.close()
    } else {
      debug(`IDS session is active`)
    }
  }
}

/**
 * Initializes a browser session with necessary authentication checks.
 *
 * @param params - Configuration parameters for the session.
 * @param params.browser - Browser instance.
 * @param params.homeUrl - Home URL to navigate to. Defaults to '/'.
 * @param params.phoneNumber - Phone number for authentication.
 * @param params.authUrl - Authentication URL.
 * @param params.idsLoginOn - IDS login config or flag.
 * @param params.delegation - Delegation parameter.
 * @param params.storageState - Path to save storage state.
 * @param params.authTrigger - Trigger for authentication.
 * @returns - Browser context with established session.
 */
export const session = async ({
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
  idsLoginOn?: boolean | { nextAuth?: { nextAuthRoot: string } }
  delegation?: string
  storageState?: string
  authTrigger?: string | ((page: Page) => Promise<string>)
}) => {
  const storagePath = join(sessionsPath, storageState)
  const context = existsSync(storagePath)
    ? await browser.newContext({ storageState: storagePath })
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

  const validationPage = await context.newPage()
  const validation = await validationPage.goto(homeUrl, {
    waitUntil: 'domcontentloaded',
  })
  expect(validation?.url()).toMatch(homeUrl)
  await validationPage.context().storageState({ path: storagePath })
  await validationPage.close()

  return context
}

/**
 * Creates a browser context with a session for the judicial system.
 * Ensures Cognito authentication if needed.
 *
 * @param params - Session parameters.
 * @param params.browser - Browser instance.
 * @param params.homeUrl - Home URL to navigate to, defaults to JUDICIAL_SYSTEM_HOME_URL.
 * @returns - Browser context.
 */
export const judicialSystemSession = async ({
  browser,
  homeUrl,
}: {
  browser: Browser
  homeUrl?: string
}) => {
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
