# @island.is/clients/ship-registry-v2

NestJS client library for the Samgongustofa Ship Registry API (Skutan-Gov-V1).

## About

This client connects to Iceland's ship registry via X-Road to access ship information and registration data maintained by Samgongustofa (Icelandic Transport Authority).

## Usage

```typescript
import {
  ShipRegistryClientV2Module,
  ShipRegistryClientV2Service,
  ShipDto,
} from '@island.is/clients/ship-registry-v2'

@Module({
  imports: [ShipRegistryClientV2Module],
})
export class YourModule {
  constructor(
    private readonly shipRegistryService: ShipRegistryClientV2Service,
  ) {}

  async getMyShips(user: User): Promise<ShipDto[]> {
    return this.shipRegistryService.getShipsByOwner(user)
  }
}
```

## API Methods

### `getShipsByOwner(user: User): Promise<ShipDto[]>`

Get all ships owned by the authenticated user.

### `getShipDetails(user: User, registryNumber: string): Promise<ShipDto | null>`

Get detailed information about a specific ship by its registry number.

## DTOs

### `ShipDto`

```typescript
interface ShipDto {
  registryNumber?: string
  name?: string
  type?: string
  length?: number
  width?: number
  ownerName?: string
  ownerNationalId?: string
  registrationDate?: Date
}
```

## Configuration

The client requires the following environment variable:

- `XROAD_SHIP_REGISTRY_PATH` - X-Road service path (configured via infrastructure DSL)

## Development

### Update OpenAPI Spec

Fetch the latest OpenAPI specification from the local X-Road proxy:

```bash
nx run clients-ship-registry-v2:update-openapi-document
```

### Generate Client Code

After updating the OpenAPI spec, generate the client code:

```bash
nx run clients-ship-registry-v2:codegen/backend-client
```

## Running unit tests

Run `nx test clients-ship-registry-v2` to execute the unit tests via [Jest](https://jestjs.io).
