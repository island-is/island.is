import { createClient } from './feature-flags'

describe('featureFlags', () => {
  beforeAll(() => {
    delete process.env.CONFIGCAT_SDK_KEY
  })

  it('should fail initializing client if sdk key is missing', async () => {
    await expect(createClient()).rejects.toThrow(
      'Trying to initialize configcat client without CONFIGCAT_SDK_KEY environment variable',
    )
  })
})
