import { Locator, Page } from '@playwright/test'

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
export const proceed = async (
  page: Page,
  testId = 'proceed',
): Promise<void> => {
  await findByTestId(page, testId).click()
}
