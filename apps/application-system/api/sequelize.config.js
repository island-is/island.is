/* eslint-env node */
module.exports = {
  development: {
    username: process.env.DB_USER_APPLICATION_SYSTEM_API || 'dev_db',
    password: process.env.DB_PASS_APPLICATION_SYSTEM_API || 'dev_db',
    database: process.env.DB_NAME_APPLICATION_SYSTEM_API || 'dev_db',
    host: 'localhost',
    port: process.env.DB_PORT_APPLICATION_SYSTEM_API || 5434,
    dialect: 'postgres',
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
