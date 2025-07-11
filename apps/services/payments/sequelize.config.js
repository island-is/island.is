/* eslint-env node */
module.exports = {
  development: {
    username: process.env.DB_USER_PAYMENTS ?? 'dev_db',
    password: process.env.DB_PASS_PAYMENTS ?? 'dev_db',
    database: process.env.DB_NAME_PAYMENTS ?? 'dev_db',
    port: process.env.DB_PORT_PAYMENTS ?? 5434,
    host: 'localhost',
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
