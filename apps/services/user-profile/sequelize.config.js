/* eslint-env node */
module.exports = {
  development: {
    username: process.env.USER_PROFILE_DB_USER ?? 'dev_db',
    password: process.env.USER_PROFILE_DB_PASS ?? 'dev_db',
    database: process.env.USER_PROFILE_DB_NAME ?? 'dev_db',
    host: 'localhost',
    dialect: 'postgres',
    port: process.env.USER_PROFILE_DB_PORT ??  5437,
  },
  test: {
    username: 'test_db',
    password: 'test_db',
    database: 'test_db',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
}
