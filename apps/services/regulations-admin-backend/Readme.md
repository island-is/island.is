## Development

1. **Install Docker** if not already installed, then execute:

   ```bash
   yarn dev-services regulations-admin-backend
   ```

2. **Clean the Database** (skip on first install):

   ```bash
   cd apps/services/regulations-admin-backend
   npx sequelize db:migrate:undo:all
   ```

3. **Run Migrations and Seed Database:**

   ```bash
   yarn dev-init regulations-admin-backend
   ```

4. **Start Backend Service:**

   ```bash
   yarn start regulations-admin-backend
   ```
