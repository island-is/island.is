<!-- gitbook-ignore -->

## Development

### Initial setup

0. Clean the database (skip this step on first install)

```bash
cd apps/services/regulations-admin-backend
npx sequelize db:migrate:undo:all
```

1. Make sure you have Docker, then run:

```bash
yarn dev-services regulations-admin-backend
```

2. Then run the migrate and seeding:

```bash
yarn dev-init regulations-admin-backend
```

3. Start the backend service:

```bash
yarn start regulations-admin-backend
```
