import { createClient } from './feature-flags'

describe('featureFlags', () => {
  beforeAll(() => {
    delete process.env.CONFIGCAT_SDK_KEY
  })
  it('should fail initializing client if sdk key is missing', () => {
    expect(createClient).toThrow()
  })
})
