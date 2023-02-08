import { Page } from '@playwright/test'
import mergeWith from 'lodash/merge'
import camelCase from 'lodash/camelCase'

function debug(...args: unknown[]) {
  if (process.env.SYSTEM_E2E_DEBUG) console.log(...args)
}

type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
  patchResponse?: boolean
  deepMockKey?: string | RegExp
  useResponseKey?: boolean
  pattern?: string
}

type Dict<T = unknown> = Record<string, T>
/**
 * Return a copy of the `eroginal` object with any sub-objects mocked as `mockData`
 */
function deepMock<T = Dict>(
  original: T | T[],
  mockKey: string | RegExp,
  mockData: unknown = {},
  { exactMatch = false, deepPath = 'data' } = {},
): T | T[] | Dict | Dict[] {
  if (Array.isArray(original)) {
    debug('Deep mocking array:', original)
    // Should do the typing properly here :/
    return original.map(
      (item: T) => deepMock(item, mockKey, mockData, { exactMatch }) as T,
    )
  }
  if (typeof original != 'object')
    return String(original).match(mockKey) ? (mockData as T) : original

  if (typeof mockKey == 'string')
    mockKey = new RegExp(exactMatch ? `^${mockKey}$` : `${mockKey}`)
  const mocked: Dict = {}
  for (const key in original) {
    const updatedDeepPath = `${deepPath}.${key}`
    if (key.match(mockKey)) {
      mocked[key] = mockData
      debug(`Found deepMock match `, {
        mockKey,
        key,
        updatedDeepPath,
        mockData,
      })
      debug(`Deep mocking mocked   data:`, mocked)
      debug(`Deep mocking original data:`, original)
    } else
      mocked[key] = deepMock(original[key], mockKey, mockData, {
        deepPath: updatedDeepPath,
      })
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
    responseKey = undefined,
    camelCaseResponseKey = !responseKey,
    patchResponse = false,
    deepMockKey = undefined,
    pattern = `**/graphql?op=${op}`,
  }: MockGQLOptions = {},
) {
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
    debug(`Got route `, { routeUrl, routeOp, casedRouteOp })

    // Get original
    const response = patchResponse ? await (await route.fetch()).json() : {}
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
      (_: unknown, source: unknown) => source,
    )
    const data: Dict<Dict> = { data: {} }
    data.data = patchedData

    // Debug logging
    debug('(mocked): ', mockResponse)
    debug('(merged): ', patchedData)

    // Mock injection
    const body = JSON.stringify(data)
    debug('Body:', body)
    route.fulfill({ body })
  })
}

export async function disableObjectKey(page: Page, key: string | RegExp) {
  return await mockQGL(page, '**', `MOCKED-${key}`, {
    deepMockKey: key,
    patchResponse: true,
  })
}

export async function disablePreviousApplications(page: Page) {
  await mockQGL(page, 'ApplicationApplications', [])
  //syslumennOnEntry.data.estates
  /*
  await mockQGL(
    page,
    'UpdateApplication',
    {
      externalData: {
        existingApplication: { data: [] },
        syslumennOnEntry: { data: {} },
      },
    },
    { patchResponse: true },
  )
  */
}

export async function disableI18n(page: Page) {
  return await mockQGL(page, 'GetTranslations', {
    'mock.translation': 'YES-mocked',
  })
}
