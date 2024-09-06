/* eslint-env node */
module.exports = {
  development: {
    username: process.env.DB_USER_SESSIONS ?? 'dev_db',
    password: process.env.DB_PASS_SESSIONS ?? 'dev_db',
    database: process.env.DB_NAME_SESSIONS ?? 'dev_db',
    host: 'localhost',
    port: process.env.DB_PORT_SESSIONS ?? 5434,
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
  test: {
    username: 'test_db',
    password: 'test_db',
    database: 'test_db',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
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
