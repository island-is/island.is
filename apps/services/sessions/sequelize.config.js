/* eslint-env node */
module.exports = {
  development: {
    username: 'dev_db' ?? process.env.DB_USER_SESSIONS,
    password: 'dev_db' ?? process.env.DB_PASS_SESSIONS,
    database: 'dev_db' ?? process.env.DB_NAME_SESSIONS,
    host: 'localhost',
    dialect: 'postgres',
    port: 5434 ?? process.env.DB_PORT_SESSIONS,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
}
