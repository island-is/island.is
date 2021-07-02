<!-- gitbook-ignore -->

# Local setup of development database

All powershell commands are run from /auth/libs/auth-api-lib.

## 1. If first install/empty db skip this step, otherwise clear all definitions

```Powershell
npx sequelize db:migrate:undo:all
```

## 2. Migrate table definitions

```Powershell
npx sequelize db:migrate
```

## 3. Run local seed data

```Powershell
./seeders/local/run.ps1
```
