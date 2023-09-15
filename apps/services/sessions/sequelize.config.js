/* eslint-env node */
module.exports = {
  development: {
    username: process.env.DB_USER_SESSIONS ?? 'dev_db',
    password: process.env.DB_PASS_SESSIONS ?? 'dev_db',
    database: process.env.DB_NAME_SESSIONS ?? 'dev_db',
    host: 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT_SESSIONS ?? 5434,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
}
