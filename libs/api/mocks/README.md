```markdown
# Mocks

This module provides mocks for the main GraphQL API.

## Usage in a New Project

1. **Initialize Mock Service Worker:**

   Add the mock service worker to your public folder by executing the following command:

   ```bash
   yarn msw init path/to/your/public/
   ```

2. **Import Mocks in Entry File:**

   Include the following import statement in your entry file:

   ```typescript
   import '@island.is/api/mocks';
   ```

3. **Configure Environment Variables:**

   Add the following line to your `.env` file to enable API mocks:

   ```
   API_MOCKS=true
   ```

   Ensure that this environment variable is accessible in your Webpack browser bundles. For example, see the configuration in a [Next.js project](../../../apps/web/next.config.js).

4. **Enable Mocks:**

   Mocks will be enabled when the environment variables are set to:

   - `process.env.NODE_ENV !== 'production'`
   - `process.env.API_MOCKS === 'true'`

   Note: All mock code should be automatically removed from production bundles.

For more detailed instructions, refer to the documentation in the [shared mocking library](../../shared/mocking/README.md).
```