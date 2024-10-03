## Development

1. Install Docker if not already installed, then execute:

   ```bash
   yarn dev-services regulations-admin-backend
   ```

2. Clean the database (skip on first install):

   ```bash
   cd apps/services/regulations-admin-backend
   npx sequelize db:migrate:undo:all
   ```

3. Run migrations and seed the database:

   ```bash
   yarn dev-init regulations-admin-backend
   ```

4. Start the backend service:

   ```bash
   yarn start regulations-admin-backend
   ```