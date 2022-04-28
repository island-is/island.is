import { getFeatureFlag } from './featureFlag'

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { configCatSdkKey: '' },
}))

jest.mock('@island.is/feature-flags', () => {
  const originalModule = jest.requireActual('@island.is/feature-flags')
  return {
    __esModule: true,
    ...originalModule,
    createClient: jest.fn(() => ({
      getValue: async (flag: string, defaultValue: boolean | string) => {
        if (flag === 'flagThatExists') return true
        return defaultValue
      },
    })),
  }
})

describe('feature flag fetching', () => {
  it('should return the actual value behind a feature flag if it exists instead of the default value', async () => {
    const flag = await getFeatureFlag('flagThatExists', false)

    // The flag should not be false(the default value) since the flag exists and we know it's set to true
    expect(flag).not.toBe(false)
    expect(flag).toBe(true)
  })

  it('should return the default value if the flag does not exist', async () => {
    const defaultValue = false
    const flag = await getFeatureFlag('flagThatDoesNotExist', defaultValue)
    expect(flag).toBe(defaultValue)
  })
})
