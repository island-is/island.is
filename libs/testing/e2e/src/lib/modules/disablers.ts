import { Page } from '@playwright/test'
import camelCase from 'lodash/camelCase'
import mergeWith from 'lodash/mergeWith'
import { debug } from '../helpers/utils'

type Matchable = string | RegExp

type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
  patchResponse?: boolean
  deepMockKey?: Matchable // or an array of Matchable values
  useResponseKey?: boolean
  pattern?: string
}

type Dictionary<T = unknown> = Record<string, T>

/**
 * Recursively mocks properties in an object or array based on a matching key.
 *
 * @param {T | T[]} original - The target object or array to apply mocks to.
 * @param {Matchable} mockKey - Key or pattern to match the properties to mock.
 * @param {unknown} [mockData={}] - Data to replace matched properties with.
 * @param {Object} [options] - Additional options for mock processing.
 * @param {boolean} [options.exactMatch=false] - If true, requires exact key match.
 * @param {string} [options.deepPath='data'] - Tracks current path during recursion (internal use).
 * @returns {T | T[] | Dictionary | Dictionary[]} - The updated mock object/array.
 */
const deepMock = <T = Dictionary>(
  original: T | T[],
  mockKey: Matchable,
  mockData: unknown = {},
  {
    exactMatch = false,
    deepPath = 'data',
  }: { exactMatch?: boolean; deepPath?: string } = {},
): T | T[] | Dictionary | Dictionary[] => {
  if (Array.isArray(original)) {
    debug('Applying deep mock to array:', original)
    return original.map(
      (item: T) => deepMock(item, mockKey, mockData, { exactMatch }) as T,
    )
  }

  if (typeof original !== 'object') {
    return String(original).match(mockKey) ? (mockData as T) : original
  }

  const regexMockKey =
    typeof mockKey === 'string'
      ? new RegExp(exactMatch ? `^${mockKey}$` : mockKey)
      : mockKey

  const mockedObject: Dictionary = {}

  for (const key in original) {
    const updatedDeepPath = `${deepPath}.${key}`
    if (key.match('currentLic')) debug('Mocking currentLic', original)

    if (key.match(regexMockKey)) {
      mockedObject.isMocked = true
      mockedObject[key] = mockData
      debug(`Found match for deepMock`, {
        mockKey,
        key,
        updatedDeepPath,
        mockData,
      })
    } else {
      mockedObject[key] = deepMock(original[key], mockKey, mockData, {
        deepPath: updatedDeepPath,
      })
    }
  }

  if (mockedObject.isMocked) {
    debug('Deep mock applied to:', mockedObject)
    debug('Original data:', original)
  }

  return mockedObject
}

/**
 * Helper function to always overwrite with source value in merge operations
 */
const overwriteMerge = (_: unknown, source: unknown): unknown => source

/**
 * Sets up a GraphQL request mock, optionally modifying the response structure.
 *
 * @param {Page} page - The Playwright page to apply the mock to.
 * @param {string} op - The GraphQL operation name to mock.
 * @param {T} mockData - Mock data to return in place of actual data.
 * @param {MockGQLOptions} options - Configuration options for the mock.
 * @returns {Promise<void>}
 */
export const mockGraphQL = async <T>(
  page: Page,
  op: string,
  mockData: T,
  {
    responseKey,
    camelCaseResponseKey = !responseKey,
    patchResponse = false,
    deepMockKey,
    pattern = `**/graphql?op=${op}`,
  }: MockGQLOptions = {},
): Promise<void> => {
  debug(`Setting up GraphQL mock for pattern ${pattern}`, {
    op,
    responseKey,
    deepMockKey,
  })

  await page.route(pattern, async (route) => {
    const requestUrl = route.request().url()
    const requestedOp = requestUrl.split('op=')[1]
    const responseOpKey = camelCaseResponseKey
      ? camelCase(requestedOp)
      : requestedOp
    debug('Handling request:', { requestUrl, requestedOp, responseOpKey, op })

    // Retrieve existing response if patching
    const responseData = patchResponse
      ? await (
          await route.fetch({
            headers: { ...route.request().headers(), MOCKED_PATCH: 'yes' },
          })
        ).json()
      : {}

    const baseResponse = { ...responseData?.data }
    const finalMockKey = responseKey ?? responseOpKey

    if (!finalMockKey) {
      throw new Error(
        `Invalid mock key configuration (mockKey=${finalMockKey}, responseKey=${responseKey}, op=${op}).`,
      )
    }

    const mockResponse: Dictionary = deepMockKey
      ? deepMock(baseResponse, deepMockKey, mockData)
      : { [finalMockKey]: mockData }

    mockResponse.deepMocked = Boolean(deepMockKey)
    mockResponse.mocked = true

    debug('Mock response details:', {
      requestUrl,
      finalMockKey,
      patchResponse,
      original: baseResponse,
      mock: mockResponse,
    })

    // Merge mock with original data if needed
    const mergedData = mergeWith(
      { ...baseResponse },
      mockResponse,
      overwriteMerge,
    )

    const responseBody: Dictionary<Dictionary> = { data: mergedData }
    debug('Final response body:', responseBody)

    await route.fulfill({
      body: JSON.stringify(responseBody),
      headers: { MOCKED: 'yes', DEEP_MOCKED: deepMockKey ? 'yes' : 'no' },
    })
  })
}

/**
 * Mocks GraphQL response for translations, providing a fixed mock.
 *
 * @param page - The Playwright page to apply the mock to.
 */
export const disableObjectKey = async <T>(
  page: Page,
  key: Matchable,
  mockData?: T,
): Promise<void> => {
  return await mockGraphQL(page, '**', mockData ?? `MOCKED-${key}`, {
    deepMockKey: key,
    patchResponse: true,
  })
}

export const disablePreviousApplications = async (page: Page) => {
  await mockGraphQL(page, 'ApplicationApplications', [])
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

export const disableI18n = async (page: Page) => {
  return await mockGraphQL(page, 'GetTranslations', {
    'mock.translation': 'YES-mocked',
  })
}

export const disableDelegations = async (page: Page) => {
  return await mockGraphQL(page, 'ActorDelegations', [])
}
