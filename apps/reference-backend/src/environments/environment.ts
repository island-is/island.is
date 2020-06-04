export default {
  production: false,
  databaseUri: `postgres://test_db:test_db@${process.env.DB_HOST ||
    'localhost'}:5432/test_db`,
}
