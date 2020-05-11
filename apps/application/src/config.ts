const config = {
  production: false,
}

const prodConfig = {
  ...config,
  production: true,
  DATABASE_URI:
    `postgres://${process.env.DB_USER}` +
    `:${process.env.DB_PASS}@${process.env.DB_HOST}` +
    `:5432/${process.env.DB_NAME}`,
}

const devConfig = {
  ...config,
  DATABASE_URI:
    `postgres://${process.env.APPLICATION_DB_USER}` +
    `:${process.env.APPLICATION_DB_PASS}@${process.env.APPLICATION_DB_HOST}` +
    `:5432/${process.env.APPLICATION_DB_NAME}`,
}

const testConfig = {
  ...config,
  DATABASE_URI:
    `postgres://${process.env.APPLICATION_TEST_DB_USER}` +
    `:${process.env.APPLICATION_TEST_DB_PASS}@${process.env.APPLICATION_DB_HOST}` +
    `:5432/${process.env.APPLICATION_TEST_DB_NAME}`,
}

export const configMap = {
  development: devConfig,
  production: prodConfig,
  test: testConfig,
}

export default configMap[process.env.NODE_ENV || 'development']
