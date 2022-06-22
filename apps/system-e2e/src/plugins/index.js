module.exports = (on, config) => {
  config.env.testEnvironment = process.env.TEST_ENVIRONMENT || 'local'
  config.env.cognitoUsername = process.env.AWS_COGNITO_USERNAME ?? 'system-e2e'
  config.env.cognitoPassword = process.env.AWS_COGNITO_PASSWORD

  config.baseUrl = config.env[config.env.testEnvironment].baseUrl

  on('before:browser:launch', (browser, launchOptions) => {
    if (['chrome', 'chromium', 'electron'].includes(browser.name)) {
      launchOptions.preferences.devTools = config.env.devTools
      return launchOptions
    }
  })

  return config
}
