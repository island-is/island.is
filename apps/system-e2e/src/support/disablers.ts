import { Page } from '@playwright/test'
import merge from 'deepmerge'

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
  {
    responseKey = op,
    camelCaseResponseKey = true,
    patchResponse = false,
  }: MockGQLOptions = {},
) {
  // Override op if given in options
  op = responseKey ?? op

  const pattern = `**/graphql?op=${op}`
  const key = camelCaseResponseKey ? toCamelCase(op) : op

  console.log(`Setting up mock (key=${key}) for ${pattern}`)
  await page.route(pattern, async (route) => {
    // Set mock
    const response = patchResponse ? await (await route.fetch()).json() : {}
    const originalData = { ...response?.data }
    const patchedData = merge(
      originalData,
      Object.fromEntries([[key, mockData]]),
      { arrayMerge: (_, source) => source },
    )
    const data = { data: patchedData }

    console.log(`Got a mock-match for > ${route.request().url()} <`)
    console.log('MOCKING ->', data)
    console.log('(original):', originalData)
    console.log('(mocked): ', mockData)
    console.log('(merged): ', patchedData)

    const body = JSON.stringify(data)
    console.log('Body:', body)
    route.fulfill({ body })
  })
}

export async function disablePreviousApplications(page: Page) {
  await mockQGL(page, 'ApplicationApplications', [])
  await mockQGL(page, 'UpdateApplication', { patchResponse: true })
  //syslumennOnEntry.data.estates
  await mockQGL(
    page,
    'UpdateApplication',
    {
      externalData: {
        existingApplication: { data: ["I'm MOCKED"] },
        syslumennOnEntry: { data: { estate: ["I'm MOCKED"] } },
      },
    },
    { patchResponse: true },
  )
}

export async function disableI18n(page: Page) {
  return await mockQGL(page, 'GetTranslations', {
    'mock.translation': 'YES-mocked',
  })
}
