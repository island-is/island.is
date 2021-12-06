/* eslint-env node */
module.exports = {
  development: {
    username: process.env.DB_USER ?? 'dev_db',
    password: process.env.DB_PASS ?? 'dev_db',
    database: process.env.DB_NAME ?? 'dev_db',
    host: 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT ?? 5433,
    seederStorage: 'sequelize',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
}
