export default {
  production: false,
  sentry: {
    dsn: '',
  },
  databaseUri:
    `postgres://${process.env.APPLICATION_DB_USER}` +
    `:${process.env.APPLICATION_DB_PASS}@${process.env.APPLICATION_DB_HOST}` +
    `:5432/${process.env.APPLICATION_DB_NAME}`,
}
