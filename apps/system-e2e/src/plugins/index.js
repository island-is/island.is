module.exports = (on, config) => {
  const testEnvironment = process.env.TEST_ENVIRONMENT || 'local'
  config.baseUrl = config.env[testEnvironment].baseUrl

  on('before:browser:launch', (browser, launchOptions) => {
    if (['chrome', 'chromium', 'electron'].includes(browser.name)) {
      launchOptions.preferences.devTools = config.env.devTools
      return launchOptions
    }
  })

  return config
}
