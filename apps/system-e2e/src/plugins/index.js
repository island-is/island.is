const testEnvironment = process.env.TEST_ENVIRONMENT
module.exports = (on, config) => {
  config.env.testEnvironment = testEnvironment
  if (testEnvironment) {
    config.baseUrl = `https://beta.${config.env.testEnvironment}01.devland.is`
  }
  on('before:browser:launch', (browser, launchOptions) => {
    if (['chrome', 'chromium', 'electron'].includes(browser.name)) {
      launchOptions.preferences.devTools = true
      return launchOptions
    }
  })

  return config
}
