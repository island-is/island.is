import { Page } from '@playwright/test'
import deepMerge from 'lodash/merge'
import camelCase from 'lodash/camelCase'

type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
  patchResponse?: boolean
  deepMockKey?: boolean
}

type Dict<T=unknown> = Record<string, T>
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
  if (!responseKey) responseKey = op
  const key = camelCaseResponseKey ? camelCase(responseKey) : responseKey

  console.log(`Setting up mock (key=${key}) for ${pattern} (deepmock=${deepMockKey})`)
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

    // Debug logging
    console.log(`Got a mock-match for > ${route.request().url()} < (via key ${key})`)
    console.log('(original):', originalResponse)

    const patchedData = deepMerge({...originalResponse}, mockResponse)
    const data: Dict<Dict> = { data: {} }
    data.data = patchedData
    data.data.mocked = true

    console.log('(mocked): ', mockResponse)
    console.log('(merged): ', patchedData)

    // Mock injection
    const body = JSON.stringify(data)
    console.log('Body:', body)
    route.fulfill({ body })
  })
}

export async function disableObjectKey(page: Page, key: string) {
  return await mockQGL(page, '**', {}, { responseKey: key, deepMockKey: true, patchResponse: true })
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
        existingApplication: { data: [] },
        syslumennOnEntry: { data: { estate: {} } },
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
