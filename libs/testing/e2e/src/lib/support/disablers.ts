import { Page } from '@playwright/test'
import mergeWith from 'lodash/merge'
import camelCase from 'lodash/camelCase'
import { debug } from './utils'

const mergeOverwrite = (_: unknown, source: unknown): unknown => {
  return source
}

type Matchable = string | RegExp
type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
  patchResponse?: boolean
  deepMockKey?: Matchable // TODO  type for this: | Matchable[]
  useResponseKey?: boolean
  pattern?: string
}

type Dict<T = unknown> = Record<string, T>
/**
 * Return a copy of the `original` object with any sub-objects mocked as `mockData`
 */
const deepMock = <T = Dict>(
  original: T | T[],
  mockKey: Matchable,
  mockData: unknown = {},
  { exactMatch = false, deepPath = 'data' } = {},
): T | T[] | Dict | Dict[] => {
  if (Array.isArray(original)) {
    debug('Deep mocking array:', original)
    // Should do the typing properly here :/
    return original.map(
      (item: T) => deepMock(item, mockKey, mockData, { exactMatch }) as T,
    )
  }
  if (typeof original != 'object') {
    return String(original).match(mockKey) ? (mockData as T) : original
  }

  if (typeof mockKey == 'string')
    mockKey = new RegExp(exactMatch ? `^${mockKey}$` : `${mockKey}`)
  const mocked: Dict = {}
  for (const key in original) {
    if (key.match('currentLic')) debug('Mocking currentLic', original)
    const updatedDeepPath = `${deepPath}.${key}`
    if (key.match(mockKey)) {
      mocked.isMocked = true
      mocked[key] = mockData
      debug(`Found deepMock match `, {
        mockKey,
        key,
        updatedDeepPath,
        mockData,
      })
    } else
      mocked[key] = deepMock(original[key], mockKey, mockData, {
        deepPath: updatedDeepPath,
      })
  }
  if (mocked.isMocked) {
    debug(`Deep mocking mocked data:`, mocked)
    debug(`Deep mocking original data:`, original)
  }
  return mocked
}

/**
 * Mock any graphql operation, returning the given mockData
 *
 * Optionally, define a different data key in the response or turn off the default camelCasing
 * of the operation.
 */
export const mockGQL = async <T>(
  page: Page,
  op: string,
  mockData: T,
  {
    responseKey = undefined,
    camelCaseResponseKey = !responseKey,
    patchResponse = false,
    deepMockKey = undefined,
    pattern = `**/graphql?op=${op}`,
  }: MockGQLOptions = {},
) => {
  debug(`Setting up mock for ${pattern} `, {
    op,
    responseKey,
    deepMockKey,
  })

  await page.route(pattern, async (route) => {
    // Setup
    const routeUrl = route.request().url()
    const routeOp = routeUrl.split('op=')[1]
    const casedRouteOp = camelCaseResponseKey ? camelCase(routeOp) : routeOp
    debug(`Got route `, { routeUrl, routeOp, casedRouteOp, op })

    // Get original
    const response = patchResponse
      ? await (
          await route.fetch({
            headers: { ...route.request().headers(), MOCKED_PATCH: 'yes' },
          })
        ).json()
      : {}
    const originalResponse = { ...response?.data }

    // Set mock
    const mockKey = responseKey ?? casedRouteOp
    if (!mockKey)
      throw Error(
        `Invalid key for mock (mockKey=${mockKey}, responseKey=${responseKey}, op=${op})!\nYou probably need to change the 'op' or add 'responseKey'`,
      )
    const mockResponse: Dict = deepMockKey
      ? deepMock(originalResponse, deepMockKey, mockData)
      : Object.fromEntries([[mockKey, mockData]])
    mockResponse.deepMocked = !!deepMockKey
    mockResponse.mocked = true

    // Debug logging
    debug(`Got a mock-match for > ${route.request().url()} < `, {
      mockKey,
      patchResponse,
    })
    debug('(original):', originalResponse)

    const patchedData = mergeWith(
      { ...originalResponse },
      mockResponse,
      mergeOverwrite,
    )
    const data: Dict<Dict> = { data: {} }
    data.data = patchedData

    // Debug logging
    debug('(mocked): ', mockResponse)
    debug('(merged): ', patchedData)

    // Mock injection
    const body = JSON.stringify(data)
    debug('Body:', body)
    route.fulfill({
      body,
      headers: { MOCKED: 'yes', DEEP_MOCKED: deepMockKey ? 'yes' : 'no' },
    })
  })
}

export const disableObjectKey = async <T>(
  page: Page,
  key: Matchable,
  mockData?: T,
) => {
  return await mockGQL(page, '**', mockData ?? `MOCKED-${key}`, {
    deepMockKey: key,
    patchResponse: true,
  })
}

export const disablePreviousApplications = async (page: Page) => {
  await mockGQL(page, 'ApplicationApplications', [])
}

/**
 * Mocks the i18n translations by returning mock data.
 */
export const disableI18n = async (page: Page): Promise<void> => {
  return mockGQL(page, 'GetTranslations', {
    'mock.translation': 'YES-mocked',
  })
}

/**
 * Disables delegations by mocking the response to return an empty array.
 */
export const disableDelegations = async (page: Page): Promise<void> => {
  return mockGQL(page, 'ActorDelegations', [])
}
