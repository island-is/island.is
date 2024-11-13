import { Locator, Page } from '@playwright/test'

type Roles = 'heading' | 'button' | 'radio'

/**
 * Generates a locator string based on the provided role and name.
 *
 * @param role - The role of the element. Can be a value from the `Roles` enum or a string.
 * @param name - The name of the element. Can be a string or an object with a `name` property.
 * @returns A string representing the locator in the format `role=<role>[name="<name>"]`.
 */
export const locatorByRole = (
  role: Roles | string,
  name: string | { name: string },
): string =>
  typeof name === 'string'
    ? `role=${role}[name="${name}"]`
    : `role=${role}[name="${name.name}"]`

/**
 * Finds a locator by role and name on the given page.
 *
 * @param page - The Playwright Page object where the locator should be found.
 * @param role - The role of the element to locate.
 * @param name - The name of the element to locate.
 * @returns The Locator object for the element with the specified role and name.
 */
export const findByRole = (
  page: Page,
  role: Roles | string,
  name: string | { name: string },
): Locator => {
  return page.locator(locatorByRole(role, name))
}

/**
 * Finds an element on the page by its `data-testid` attribute.
 *
 * @param page - The Playwright Page object to search within.
 * @param name - The value of the `data-testid` attribute to search for.
 * @returns A Locator object representing the found element.
 */
export const findByTestId = (page: Page, name: string): Locator => {
  return page.locator(`[data-testid="${name}"]`)
}

/**
 * Clicks on the element with the data-testid attribute "proceed".
 *
 * @param page - The Playwright Page object representing the browser page.
 * @returns A promise that resolves when the click action is completed.
 */
export const proceed = async (page: Page): Promise<void> => {
  await page.locator('[data-testid="proceed"]').click()
}
