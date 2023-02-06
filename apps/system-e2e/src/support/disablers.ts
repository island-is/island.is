import { Page } from '@playwright/test'
import deepMerge from 'lodash/merge'
import camelCase from 'lodash/camelCase'

type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
  patchResponse?: boolean
  deepMockKey?: boolean
}

type Dict = Record<string, unknown>
/**
 * Return a copy of the `eroginal` object with any sub-objects mocked as `mockData`
 */
function deepMock<T = Dict>(
  original: T,
  mockKey: string | RegExp,
  mockData: unknown = {},
) {
  if (typeof original != 'object') throw Error('Not Object')
  if (typeof mockKey == 'string') mockKey = new RegExp(`^${mockKey}$`)
  const mocked: Dict = {}
  for (const key in original) {
    if (key.match(mockKey)) mocked[key] = mockData
    else mocked[key] = deepMock(original[key], mockKey, mockData)
  }
  return mocked
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
    responseKey = '',
    camelCaseResponseKey = !responseKey,
    patchResponse = false,
    deepMockKey = false,
  }: MockGQLOptions = {},
) {
  const pattern = `**/graphql?op=${op}`
  responseKey = responseKey ?? op
  const key = camelCaseResponseKey ? camelCase(responseKey) : responseKey

  console.log(`Setting up mock (key=${key}) for ${pattern}`)
  await page.route(pattern, async (route) => {
    // Set mock
    const response = patchResponse ? await (await route.fetch()).json() : {}
    const originalResponse = { ...response?.data }
    const mockResponse = Object.fromEntries([
      [
        key,
        !deepMockKey ? mockData : deepMock(originalResponse, key, mockData),
      ],
    ])

    const patchedData = deepMerge(originalResponse, mockResponse)
    const data = { data: {} }

    // Debug logging
    console.log(`Got a mock-match for > ${route.request().url()} <`)
    console.log('MOCKING ->', data)
    console.log('(original):', originalResponse)
    console.log('(mocked): ', mockData)
    console.log('(merged): ', patchedData)

    // Mock injection
    const body = JSON.stringify(data)
    console.log('Body:', body)
    route.fulfill({ body })
  })
}

export async function disableObjectKey(page: Page, key: string) {
  return await mockQGL(page, '*', {}, { responseKey: key, deepMockKey: true })
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
        existingApplication: { data: [], mocked: true },
        syslumennOnEntry: { data: { estate: {}, mocked: true } },
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
