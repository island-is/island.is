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

  it('mocks outside production', () => {
    process.env.NODE_ENV = 'development'

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
})
