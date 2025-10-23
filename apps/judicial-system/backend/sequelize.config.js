/* eslint-env node */

module.exports = {
  development: {
    username: 'judicial_system',
    password: 'I47H91GsTsuTvqFwRxd580LCQwF1BSpv',
    database: 'judicial_system',
    host: 'localhost',
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
