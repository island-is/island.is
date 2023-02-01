import { Page } from '@playwright/test'

type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
}

/**
 * Mock any graphql operation, returning the given mockData
 *
 * Optionally, define a different data key in the response or turn off the default camelCasing
 * of the operation.
 */
export async function mockQGL<T>(
  page: Page,
  op: string,
  mockData: T,
  options: MockGQLOptions = { responseKey: op, camelCaseResponseKey: true },
) {
  // Key in return data; using options on instantiation
  const key = (options?.responseKey ?? op).replace(/^(.)/, (s) =>
    options?.camelCaseResponseKey ? s.toLowerCase() : s,
  )
  const routeRegex = `**/graphql?op=${key}`
  console.log(`Returning ${mockData} for all calls to ${routeRegex}`)
  await page.route(routeRegex, (route) => {
    console.log(`Matched route ${route} for ${routeRegex}!`)
    const data: Record<string, T> = {}
    data[key] = mockData
    const response = { data }
    console.log('Setting mocked response:', response)
    route.fulfill({ body: JSON.stringify(response) })
  })
}

export async function disablePreviousApplications(page: Page) {
  await mockQGL(page, 'ApplicationApplications', [])
}

export async function disableI18n(page: Page) {
  await mockQGL(page, 'GetTranslations', {})
}
