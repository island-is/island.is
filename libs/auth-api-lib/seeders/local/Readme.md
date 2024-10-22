# Local Setup of Development Database

1. Clear All Definitions (Skip if First Install/Empty DB)

   ```bash
   npx sequelize db:migrate:undo:all
   ```

2. Migrate Table Definitions

   ```bash
   npx sequelize db:migrate
   ```

3. Run Local Seed Data

   ```bash
   yarn nx run services-auth-ids-api:seed
   ```

