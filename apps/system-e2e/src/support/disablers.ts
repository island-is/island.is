import { Page } from '@playwright/test'

type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
  patchResponse?: boolean
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
  { responseKey= op, camelCaseResponseKey= true, patchResponse= false }: MockGQLOptions = {},
) {
    // Override op if given in options
    op = responseKey ?? op

    const pattern = `**/graphql?op=${op}`
    const key = camelCaseResponseKey? toCamelCase(op) : op

    console.log(`Setting up mock (key=${key}) for ${pattern}`)
    await page.route(pattern, async route => {
      // Set mock
      const response = patchResponse? await (await route.fetch()).json() : {}
      const payload = {...response?.data}
      console.log("Payload:", payload)
      console.log("Payload (externalData):", payload[key]?.externalData)

      // TODO handle nested object
      payload[key] = Array.isArray(mockData)? mockData: {...mockData}
      const data = {data: payload}

      console.log(`Got a mock-match for > ${route.request().url()} <`)
      console.log('MOCKING ->', data)
      route.fulfill({ body: JSON.stringify(data) })
    })
}

export async function disablePreviousApplications(page: Page) {
  await mockQGL(page, 'ApplicationApplications', [])
  await mockQGL(page, 'UpdateApplication', {externalData: {existingApplication: null}}, {patchResponse: true})
}

export async function disableI18n(page: Page) {
    return await mockQGL(page, 'GetTranslations', {'mock.translation': "YES-mocked"})
}
