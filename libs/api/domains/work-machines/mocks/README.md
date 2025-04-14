# Mocks

Provides mocks for the main GraphQL api.

## Usage in new project

Add the mock service worker to your public folder by running:

```bash
yarn msw init path/to/your/public/
```

then add this line to your entry file:

```typescript
import '@island.is/api/mocks'
```

Add `API_MOCKS=true` to your `.env` file and make sure it is available in your webpack browser bundles ([Next.JS example](../../../apps/web/next.config.js)).

Mocks will be enabled when `process.env.NODE_ENV !== 'production' && process.env.API_MOCKS === 'true'`. All mock code should be automatically removed from production bundles.

For more information, check out the documentation in [`libs/shared/mocking`](../../shared/mocking/README.md).
