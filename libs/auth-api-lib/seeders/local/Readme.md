````markdown
# Local Setup of Development Database

Follow these steps to set up your development database locally.

## 1. Clear All Definitions (If Needed)

_Note_: If this is the first installation or the database is empty, skip this step. Otherwise, execute the following command to clear all existing table definitions:

```bash
npx sequelize db:migrate:undo:all
```
````

## 2. Migrate Table Definitions

Execute the following command to migrate table definitions:

```bash
npx sequelize db:migrate
```

## 3. Seed Local Data

Run the following command to populate your local database with seed data:

```bash
yarn nx run services-auth-ids-api:seed
```

```

```
