module.exports = {
  development: {
    username: process.env.APPLICATION_DB_USER,
    password: process.env.APPLICATION_DB_PASS,
    database: process.env.APPLICATION_DB_NAME,
    host: process.env.APPLICATION_DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.APPLICATION_TEST_DB_USER,
    password: process.env.APPLICATION_TEST_DB_PASS,
    database: process.env.APPLICATION_TEST_DB_NAME,
    host: process.env.APPLICATION_DB_HOST,
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
