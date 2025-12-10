import { Page } from '@playwright/test'
import { isUuid } from 'uuidv4'

/**
 * Creates a new application if there are existing applications on the overview page.
 *
 * This function waits for the applications to load on the overview page by waiting for a
 * specific GraphQL response. It then counts the number of existing applications. If there
 * are existing applications, it clicks the button to create a new application.
 *
 * @param page - The Playwright Page object representing the browser page.
 * @returns The number of existing applications.
 */
export const createApplication = async (page: Page): Promise<number> => {
  // Wait for the response from the GraphQL API endpoint that lists applications
  const applicationResponse = await page.waitForResponse(
    '**/api/graphql?op=ApplicationApplications',
  )
  const applicationData = await applicationResponse.json()
  const existingApplicationCount =
    applicationData.data.applicationApplications.length || 0

  // If there are existing applications, click the button to create a new application
  if (existingApplicationCount > 0) {
    await page.getByTestId('create-new-application').click()
  }

  return existingApplicationCount
}

export const isApplication = (page: Page, expectedPath?: string) => {
  const applicationUrl = new URL(page.url())
  const pathSegments = applicationUrl.pathname.split('/').filter(Boolean) // Filter(Boolean) removes empty strings from array

  const uuidSegment = pathSegments.pop()
  const umsoknirSegment = pathSegments.pop()

  return (
    isUuid(uuidSegment ?? '') &&
    umsoknirSegment === 'umsoknir' &&
    (!expectedPath || applicationUrl.pathname.includes(expectedPath))
  )
}
