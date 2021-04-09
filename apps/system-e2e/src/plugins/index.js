module.exports = (on, config) => {
  config.env.testEnvironment = process.env.TEST_ENVIRONMENT ?? 'dev'
  config.env.cognito_username = process.env.AWS_COGNITO_USERNAME ?? 'system-e2e'
  config.env.cognito_password = process.env.AWS_COGNITO_PASSWORD
  return config
}
