import { Page, BrowserContext } from '@playwright/test'

/**
 * Waits for a network request to complete and verifies its operation name.
 *
 * @param page - The Playwright Page object to interact with.
 * @param url - The URL substring to match the request.
 * @param op - The operation name to verify in the request's post data.
 * @returns A promise that resolves to the JSON response of the matched request.
 */
export const verifyRequestCompletion = async (
  page: Page,
  url: string,
  op: string,
) => {
  const response = await page.waitForResponse(
    (resp) =>
      resp.url().includes(url) &&
      resp.request().postDataJSON().operationName === op,
  )

  return await response.json()
}

/**
 * Creates a new page in the given browser context and navigates to the specified URL.
 *
 * @param context - The browser context in which to create the new page.
 * @param url - The URL to navigate to.
 * @returns A promise that resolves to the created page.
 */
export const createPageAndNavigate = async (
  context: BrowserContext,
  url: string,
) => {
  const page = await context.newPage()
  await page.goto(url)
  return page
}
