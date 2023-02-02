/* eslint-env node */
module.exports = {
  development: {
    username: 'dev_db',
    password: 'dev_db',
    database: 'dev_db',
    host: 'localhost',
    dialect: 'postgres',
    port: 5434,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
}
