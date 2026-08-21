# @island.is/clients/financial-management-authority-employees

Client library for the FJS (Fjársýsla ríkisins) Elfur Organization/Employee API.

## Features

- Fetch employees for a given organization by fjárlananúmer (`fjarlagalidurConstant`)
- Machine-to-machine authentication via IDS token endpoint (client credentials flow)

## Prerequisites

- `FINANCIAL_MANAGEMENT_AUTHORITY_BASE_PATH` — CDN base URL for the Elfur API
- `FINANCIAL_MANAGEMENT_AUTHORITY_IDS_URL` — IDS auth server URL
- `FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_ID` — OAuth2 client ID
- `FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_SECRET` — OAuth2 client secret (k8s secret)
- `FINANCIAL_MANAGEMENT_AUTHORITY_EXECUTE_AS_USERNAME` — username for `X-ExecuteAsUsername` header (k8s secret)

## Usage

```typescript
import { FinancialManagementAuthorityEmployeesClientModule } from '@island.is/clients/financial-management-authority-employees'

@Module({
  imports: [FinancialManagementAuthorityEmployeesClientModule],
})
export class MyModule {}
```

## Codegen

To regenerate the API client from the OpenAPI spec:

```bash
nx run clients-financial-management-authority-employees:update-openapi-document
nx run clients-financial-management-authority-employees:codegen/backend-client
```
