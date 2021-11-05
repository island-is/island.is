describe('Config definitions', () => {
  describe('when loaded and injected', () => {
    it('should work')
    it('should return hard coded values')
    it('should return optional environment variables when defined')
    it('should return optional environment as undefined when not defined')
    it('should return required environment variables when defined')
    it('should return parsed JSON environment variables when defined')
    it('should throw an error if there is an error parsing JSON environment variables')

    describe('in development', () => {
      it('should return devFallback when required variables are missing')
      it('should return isConfigured = true if all missing required variables have a devFallback')
      it('should return isConfigured = false if any missing required variables don\'t have a devFallback')
      it('should log a warning if any missing required variables don\'t have a devFallback')
    })

    describe('in production', () => {

    })
  })

  it('when not loaded, should crash with a DI error')
})
