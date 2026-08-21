import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { shouldRenderMockDataSection } from './prerequisiteMockDataUtils'

jest.mock('@island.is/shared/utils', () => {
  const actual = jest.requireActual('@island.is/shared/utils')
  return {
    ...actual,
    isRunningOnEnvironment: jest.fn((environment: string) =>
      actual.isRunningOnEnvironment(environment),
    ),
  }
})

describe('shouldRenderMockDataSection', () => {
  afterEach(() => {
    const actual = jest.requireActual('@island.is/shared/utils')
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) =>
        actual.isRunningOnEnvironment(environment),
      )
  })

  it('is false on production', () => {
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) => environment === 'production')

    expect(shouldRenderMockDataSection()).toBe(false)
  })

  it('is true off production', () => {
    expect(shouldRenderMockDataSection()).toBe(true)
  })
})
