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
    replication: {
      read: [
        {
          host: process.env.DB_REPLICAS_HOST,
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
        },
      ],
      write: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
    },
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
}
