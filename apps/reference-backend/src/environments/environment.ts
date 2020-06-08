export default {
  production: false,
  databaseUri: `postgres://${process.env.APPLICATION_DB_USER || 'dev_db'}` +
  `:${process.env.APPLICATION_DB_PASS || 'dev_db'}@${process.env.DB_HOST || 'localhost'}` +
  `:5432/${process.env.APPLICATION_DB_NAME || 'dev_db'}`,
}
