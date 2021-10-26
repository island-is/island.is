import { ServerSideFeature } from './types'

describe('Server-side-client feature flags', () => {
  it('should throw an error when calling isOn on client side ', () => {
    const { ServerSideFeatureClient } = require('./server-side-client')
    try {
      ServerSideFeatureClient.isOn('do-not-remove-for-testing-only')
      expect(false).toBe(true)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
