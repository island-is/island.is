describe('datadogTrace', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  describe('shouldMask', () => {
    it('should always be on when magic environment variable is not set', () => {
      const ddtrace = require('./datadog-tracer') //eslint-disable-line

      expect(ddtrace.shouldMask()).toBeTruthy()
      expect(ddtrace.shouldMask(200)).toBeTruthy()
      expect(ddtrace.shouldMask(300)).toBeTruthy()
      expect(ddtrace.shouldMask(400)).toBeTruthy()
      expect(ddtrace.shouldMask(500)).toBeTruthy()
    })
    it('should be off for http >= 400 when magic environment variable is set', () => {
      process.env.DD_PII_MASKING_DISABLED_ON_FAILURE = 'true'
      const ddtrace = require('./datadog-tracer') //eslint-disable-line

      expect(ddtrace.shouldMask()).toBeTruthy()
      expect(ddtrace.shouldMask(200)).toBeTruthy()
      expect(ddtrace.shouldMask(300)).toBeTruthy()
      expect(ddtrace.shouldMask(400)).toBeFalsy()
      expect(ddtrace.shouldMask(500)).toBeFalsy()
    })
  })
})
