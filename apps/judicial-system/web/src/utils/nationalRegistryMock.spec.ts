import { shouldMockNationalRegistry } from './nationalRegistryMock'

describe('shouldMockNationalRegistry', () => {
  const env = process.env

  beforeEach(() => {
    process.env = { ...env }
    delete process.env.MOCK_NATIONAL_REGISTRY
  })

  afterAll(() => {
    process.env = env
  })

  it.each(['development', 'test'])('mocks in %s', (nodeEnv) => {
    process.env.NODE_ENV = nodeEnv

    expect(shouldMockNationalRegistry()).toBe(true)
  })

  it('calls the registry in production by default', () => {
    process.env.NODE_ENV = 'production'

    expect(shouldMockNationalRegistry()).toBe(false)
  })

  it('mocks in production when explicitly opted in', () => {
    process.env.NODE_ENV = 'production'
    process.env.MOCK_NATIONAL_REGISTRY = 'true'

    expect(shouldMockNationalRegistry()).toBe(true)
  })

  it('calls the registry when NODE_ENV is unset', () => {
    delete process.env.NODE_ENV

    expect(shouldMockNationalRegistry()).toBe(false)
  })

  it('calls the registry when NODE_ENV is unset even if opted in', () => {
    delete process.env.NODE_ENV
    process.env.MOCK_NATIONAL_REGISTRY = 'true'

    expect(shouldMockNationalRegistry()).toBe(false)
  })

  it.each(['prod', 'Production', 'staging'])(
    'calls the registry when NODE_ENV is %s',
    (nodeEnv) => {
      process.env.NODE_ENV = nodeEnv
      process.env.MOCK_NATIONAL_REGISTRY = 'true'

      expect(shouldMockNationalRegistry()).toBe(false)
    },
  )
})
