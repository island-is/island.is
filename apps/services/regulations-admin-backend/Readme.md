<!-- gitbook-ignore -->

## Development

1. Start the resources with docker-compose:

```bash
docker-compose -f apps/services/regulations-admin-backend/docker-compose.base.yml -f apps/services/regulations-admin-backend/docker-compose.dev.yml up
```

2. Start the backend service:

```bash
yarn start regulations-admin-backend
```

3. Clean the database (skip this step on first install)

```bash
cd apps/services/regulations-admin-backend
npx sequelize db:migrate:undo:all
```

4. Migrate table definitions

```bash
cd apps/services/regulations-admin-backend
npx sequelize db:migrate
```

5. Run local seed data

```bash
cd apps/services/regulations-admin-backend
npx sequelize db:seed:undo:all
npx sequelize db:seed:all
```
