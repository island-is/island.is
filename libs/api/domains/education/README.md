# API Domains Education

GraphQL domain module for education-related data in the island.is API. Aggregates data from MMS (primary school assessments), INNA (secondary school graduations), and Frigg (university).

## Usage

Register `EducationModule` in your API app module:

```typescript
import { EducationModule } from '@island.is/api/domains/education'

@Module({
  imports: [
    EducationModule.register({
      fileDownloadBucket: '...',
      xroad: { ... },
    }),
  ],
})
export class AppModule {}
```

## Dependencies

- [`@island.is/clients/mms/primary-school`](../../../clients/mms/primary-school/README.md) — Primary school assessments via X-Road
- `@island.is/clients/mms/frigg` — University data
- `@island.is/clients/inna` — Secondary school graduation data
- `@island.is/clients/national-registry-v3` — Student identity lookups

## Running unit tests

Run `nx test api-domains-education` to execute the unit tests via [Jest](https://jestjs.io).
