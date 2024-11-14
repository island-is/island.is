import { expect, Page } from '@playwright/test'
import { urls, shouldSkipNavigation } from '../modules/urls'
import { debug } from '../helpers/utils'

export type CognitoCreds = {
  username: string
  password: string
}

/**
 * Retrieves Cognito credentials from environment variables.
 *
 * @returns {CognitoCreds} An object containing the username and password.
 * @throws {Error} If either the username or password environment variables are missing.
 */
const getCognitoCredentials = (): CognitoCreds => {
  const username = process.env.AWS_COGNITO_USERNAME
  const password = process.env.AWS_COGNITO_PASSWORD

  if (!username || !password) throw new Error('Cognito credentials missing')
  return { username, password }
}

/**
 * Performs Cognito login for the application.
 *
 * @param page - The Playwright Page object representing the browser page.
 * @param home - The home URL of the application.
 * @param authUrl - The authentication URL for Cognito.
 * @param creds - Optional Cognito credentials. If not provided, default credentials will be used.
 *
 * @returns A promise that resolves when the login process is complete.
 */
export const cognitoLogin = async (
  page: Page,
  home: string,
  authUrl: string,
  creds?: CognitoCreds,
) => {
  if (
    page.url().startsWith('https://ids-users.auth.eu-west-1.amazoncognito.com/')
  ) {
    await page.getByRole('button', { name: 'ids-deprecated' }).click()
  }

  const { username, password } = creds ?? getCognitoCredentials()
  const cognitoForm = page.locator('form[name="cognitoSignInForm"]:visible')

  await cognitoForm
    .locator('input[id="signInFormUsername"]:visible')
    .type(username)
  const passwordInput = cognitoForm.locator(
    'input[id="signInFormPassword"]:visible',
  )
  await passwordInput.selectText()
  await passwordInput.type(password)
  await cognitoForm.locator('input[name="signInSubmitButton"]:visible').click()

  if (shouldSkipNavigation(home)) return

  await page.waitForURL(new RegExp(`${home}|${authUrl}`))
}

/**
 * Performs IDS login using a phone number, with optional delegation handling.
 *
 * @param page - The Playwright Page object representing the browser page.
 * @param phoneNumber - The phone number of the user to log in.
 * @param home - The URL to navigate to after login.
 * @param delegation - Optional. The delegation identifier or name to select during login.
 *
 * @returns A promise that resolves when the login process is complete.
 */
export const idsLogin = async (
  page: Page,
  phoneNumber: string,
  home: string,
  delegation?: string,
) => {
  await page.waitForURL(`${urls.authUrl}/**`, { timeout: 15000 })

  await page.locator('#phoneUserIdentifier').fill(phoneNumber)
  const submitButton = page.locator('button[id="submitPhoneNumber"]')
  await expect(submitButton).toBeEnabled()
  await submitButton.click()

  await page.waitForURL(
    new RegExp(`${home}|${urls.authUrl}/(app/)?delegation`),
    {
      waitUntil: 'domcontentloaded',
    },
  )

  // Handle delegation on login
  if (page.url().startsWith(urls.authUrl)) {
    debug('Still on auth site')
    /**
     * Not using accessible selector here because this test needs to work on both the new and current login page at the same time to handle the transition gracefully
     * TODO: use accessible selector when the new login pages is out
     */
    const delegations = page.locator('.identity-card--name')
    await expect(delegations).not.toHaveCount(0)

    // Default to the first delegation if none specified
    if (!delegation) {
      await delegations.first().click()
    } else {
      const filteredDelegations = page.getByRole('button', {
        name: delegation.match(/^[0-9-]+$/)
          ? delegation.replace(/(\d{6})-?(\d{4})/, '$1-$2')
          : delegation,
      })
      await filteredDelegations.first().click()
    }

    await page.waitForURL(new RegExp(`${home}`), {
      waitUntil: 'domcontentloaded',
    })
  }
}

/**
 * Switches the user in the application by interacting with the user menu.
 *
 * @param page - The Playwright Page object representing the browser page.
 * @param homeUrl - The URL of the home page to wait for after switching the user.
 * @param name - (Optional) The name of the user to switch to. If not provided, the function will only open the user menu.
 *
 * @returns A promise that resolves when the user has been switched and the home page has loaded.
 */
export const switchUser = async (
  page: Page,
  homeUrl: string,
  name?: string,
) => {
  await page.locator('[data-testid="user-menu"]:visible').click()
  await page.getByRole('button', { name: 'Skipta um notanda' }).click()

  if (name) {
    await page.getByRole('button', { name }).click()
    await page.waitForURL(new RegExp(homeUrl), {
      waitUntil: 'domcontentloaded',
    })
  }
}
