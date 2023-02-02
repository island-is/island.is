import { Page } from '@playwright/test'

type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
}

function toCamelCase(s: string) {
  const loweredHead = s[0].toLowerCase() ?? ''
  const camelCased = s.replace(/^./, loweredHead)
  console.log(`camelcased: ${s} -> ${camelCased}`)
  return camelCased
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
  options = { responseKey: op, camelCaseResponseKey: true, patchResponse: false },
) {
    // Override op if given in options
    op = options?.responseKey ?? op

    const pattern = `**/graphql?op=${op}`
    const key = options.camelCaseResponseKey? toCamelCase(op) : op

    console.log(`Setting up mock for ${pattern}`)
    await page.route(pattern, async route => {
      // Set mock
      const response = options.patchResponse? await (await route.fetch()).json() : {}
      const payload = {...response}
      // TODO handle nested object
      payload[key] = mockData
      const data = {data: payload}

      console.log(`Got a mock-match for > ${route.request().url()} <`)
      console.log('MOCKING ->', data)
      route.fulfill({ body: JSON.stringify(data) })
    })
}

export async function disablePreviousApplications(page: Page) {
  return await mockQGL(page, 'ApplicationApplications', [])
}

export async function disableI18n(page: Page) {
    return await mockQGL(page, 'GetTranslations', {'mock.translation': "YES-mocked"})
}
