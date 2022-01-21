<!-- gitbook-ignore -->

## Development

1. Start the resources with docker-compose:

```bash
docker-compose -f apps/services/regulations-admin-backend/docker-compose.yml up
```

2. Clean the database (skip this step on first install)

```bash
cd apps/services/regulations-admin-backend
npx sequelize db:migrate:undo:all
```

3. Migrate table definitions

```bash
cd apps/services/regulations-admin-backend
npx sequelize db:migrate
```

4. Run local seed data

```bash
cd apps/services/regulations-admin-backend
npx sequelize db:seed:undo:all
npx sequelize db:seed:all
```

5. Start the backend service:

```bash
yarn start regulations-admin-backend
```
