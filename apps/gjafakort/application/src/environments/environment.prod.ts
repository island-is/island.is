export const environment = {
  production: true,
  databaseUri:
    `postgres://${process.env.DB_USER}` +
    `:${process.env.DB_PASS}@${process.env.DB_HOST}` +
    `:5432/${process.env.DB_NAME}`,
}
