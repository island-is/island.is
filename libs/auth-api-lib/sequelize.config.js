/* eslint-env node */
module.exports = {
  development: {
    username: 'postgres',
    password: 'asdfasdf',
    database: 'dev_db',
    host: 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: 'asdfasdf',
    database: 'test_db',
    host: 'localhost',
    dialect: 'postgres',
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
