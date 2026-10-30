# Estates Client

NestJS client library for the Syslumenn (District Commissioners) `islandisestatepages` API, accessed via X-Road.

## Overview

This client exposes estate-related endpoints from the Syslumenn X-Road service. It follows the same provider/module pattern as `@island.is/clients/district-commissioners-licenses`.

## Prerequisites

- Local X-Road security server proxy running on `localhost:8081`
- `XROAD_CLIENT_ID` environment variable set (for `update-openapi-document`)
- IDS (Identity Server) configured for token exchange (autoAuth)

## X-Road Path

| Environment | Path |
|-------------|------|
| dev | `IS-DEV/GOV/10016/Syslumenn-Protected/islandisestatepages` |
| staging | TODO |
| prod | TODO |

## Generating the API client

```bash
# 1. Fetch the OpenAPI spec from the live X-Road proxy
nx run clients-estates:update-openapi-document

# 2. Generate TypeScript client from the spec
nx run clients-estates:codegen/backend-client
```

## Usage

Import `EstatesClientModule` in your NestJS domain module and inject `EstatesService`:

```typescript
import { EstatesClientModule } from '@island.is/clients/estates'

@Module({
  imports: [EstatesClientModule],
})
export class MyDomainModule {}
```

Register `EstatesClientConfig` in `apps/api/src/app/app.module.ts` under `ConfigModule.forRoot()`.

## Configuration

| Env var | Default (dev) |
|---------|--------------|
| `XROAD_ESTATES_PATH` | `IS-DEV/GOV/10016/Syslumenn-Protected/islandisestatepages` |

## Notes

- The `gen/fetch/` directory contains stub files. Run the codegen steps above once the X-Road proxy is available to replace them with real generated code.
- The scope placeholder uses `DistrictCommissionersScope.dcLicensesScope` — update once an estates-specific OAuth scope is defined by the API team.
