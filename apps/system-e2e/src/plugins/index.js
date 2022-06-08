const testEnvironment = process.env.TEST_ENVIRONMENT
module.exports = (on, config) => {
  config.env.testEnvironment = testEnvironment
  config.env.cognito_username = process.env.AWS_COGNITO_USERNAME ?? 'system-e2e'
  config.env.cognito_password = process.env.AWS_COGNITO_PASSWORD
  if (testEnvironment) {
    config.baseUrl = `https://beta.${config.env.testEnvironment}01.devland.is`
  }
  return config
}
