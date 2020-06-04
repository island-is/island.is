describe('logging', () => {
  describe('log level', () => {
    const ENV = process.env

    afterEach(() => {
      jest.resetModules()
      process.env = { ...ENV }
    })

    it('should use level debug as default', async () => {
      const logLevel = 'debug'

      const { logger } = await import('./logging')

      expect(logger.level).toEqual(logLevel)
    })

    it('should use LOG_LEVEL env variable if is defined and in production', async () => {
      const logLevel = 'warn'
      process.env.NODE_ENV = 'production'
      process.env.LOG_LEVEL = logLevel

      const { logger } = await import('./logging')

      expect(logger.level).toEqual(logLevel)
    })

    it('should use info level if in production and LOG_LEVEL is undefined', async () => {
      const logLevel = 'info'
      process.env.NODE_ENV = 'production'

      const { logger } = await import('./logging')

      expect(logger.level).toEqual(logLevel)
    })
  })
})
