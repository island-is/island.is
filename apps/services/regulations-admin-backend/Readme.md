## Development

1. Ensure Docker is installed on your system and then execute:

   ```bash
   yarn dev-services regulations-admin-backend
   ```

2. Clean the database (This step is optional during the initial installation):

   ```bash
   cd apps/services/regulations-admin-backend
   npx sequelize db:migrate:undo:all
   ```

3. Run the migration and seed scripts:

   ```bash
   yarn dev-init regulations-admin-backend
   ```

4. Start the backend service:

   ```bash
   yarn start regulations-admin-backend
   ```