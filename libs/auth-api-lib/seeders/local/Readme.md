# Local setup of development database

## 1. If first install/empty db skip this step, otherwise clear all definitions

```
npx sequelize db:migrate:undo:all
```

## 2. Migrate table definitions

```
npx sequelize db:migrate
```

## 3. Run local seed data

```
yarn nx run services-auth-ids-api:seed
```
