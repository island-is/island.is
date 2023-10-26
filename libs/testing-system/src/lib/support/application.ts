import { Page } from '@playwright/test'

/**  TODO: Check typing from GQL  */
/**
 Creates a new application and returns the number of applications before creation.
 @async
 @function
 @param page - Playwright Page object representing the current page.
 @returns - The number of applications before the new application is created.
 This function waits for the applications to load on the overview page and
 counts the number of applications. If there is an existing application, the
 overview page will not redirect to a new application. In this case, the function
 clicks the 'create-new-application' button to create a new application.
 */
export const createApplication = async (page: Page): Promise<number> => {
  // Wait for the applications to load on the overview and count the number of applications
  const response = await page.waitForResponse(
    '**/api/graphql?op=ApplicationApplications',
  )
  const responseData = await response.json()
  const numberOfApplications = (responseData.data.applicationApplications
    .length || 0) as number
  // if there is an application, the overview won't redirect to a new application and we need
  // to click the button to create a new application
  if (numberOfApplications > 0) {
    await page.getByTestId('create-new-application').click()
  }
  return numberOfApplications
}
