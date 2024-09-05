/* eslint-env node */
module.exports = {
  development: {
    username: 'dev_db',
    password: 'dev_db',
    database: 'dev_db',
    host: 'localhost',
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
    username: 'prod_db',
    password: 'prod_db',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
}
