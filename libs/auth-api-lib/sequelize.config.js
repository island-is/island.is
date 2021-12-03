/* eslint-env node */
module.exports = {
  development: {
    username: 'servicesauth',
    password: 'WdmSuxMNDHT5XXm',
    database: 'servicesauth',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
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
