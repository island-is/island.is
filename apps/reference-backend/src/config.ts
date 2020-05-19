const config = {
  DATABASE_URI: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
}

const prodConfig = {
  ...config,
}

const devConfig = {
  DATABASE_URI: `postgres://test_db:test_db@localhost:5432/test_db`,
}

const testConfig = {
  ...config,
  DATABASE_URI: `postgres://${process.env.TEST_DB_USER}:${process.env.TEST_DB_PASS}@${process.env.DB_HOST}:5432/${process.env.TEST_DB_NAME}`,
}

export const configMap = {
  development: devConfig,
  production: prodConfig,
  test: testConfig,
}

export default configMap[process.env.NODE_ENV || 'development']
