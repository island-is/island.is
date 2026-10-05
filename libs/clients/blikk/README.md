# clients-blikk

NestJS client for the [Blikk](https://blikk.tech) e-commerce payments API, used by `services-payments` for the bank-transfer payment method. The client is generated from Blikk's OpenAPI document with `@hey-api/openapi-ts`; `BlikkClientService` wraps the operations we use and converts failures to `BlikkClientError`.

## Usage

Load `BlikkClientConfig` in your app's `ConfigModule` and import `BlikkClientModule`:

```typescript
import { BlikkClientModule } from '@island.is/clients/blikk'

@Module({
  imports: [BlikkClientModule],
})
export class YourModule {}
```

## OpenAPI document

The document is published next to Blikk's API reference (https://api.blikk.tech/ecom/docs) at https://api.blikk.tech/ecom/openapi.json. To update `src/clientConfig.json`:

```sh
yarn nx run clients-blikk:update-openapi-document
```

Blikk's document references `#/components/schemas/PaymentCallback` from its operation callbacks but only defines that schema inline under `components.callbacks`, which breaks code generation. The update target copies it into `components.schemas` with `jq`.

## Code generation

```sh
yarn nx run clients-blikk:codegen/backend-client
```

BigInt transformation is turned off in `openapi-ts.config.ts`: Blikk marks amounts and timestamps as `int64`, and a BigInt would be serialised as a JSON string, which Blikk rejects for integer fields.

Responses are validated against the document's schemas with the generated Zod schemas (`zod.gen.ts`, targeting Zod 3). The validator coerces `int64` fields to BigInt, but the generated client returns the body as received, so they stay numbers. The generated client returns `{}` for an empty body without validating it, so the `response-bodies` plugin from `@island.is/clients/middlewares` also generates `responseBodies.gen.ts`, and `BlikkClientModule` registers an interceptor that rejects an empty 2xx where the document declares a JSON body for that status. `cancelPayment` opts out of both checks because its response body is never read.

## Configuration

- `BLIKK_API_KEY`: sales channel API key, sent in the `API-Key` header
- `BLIKK_API_BASE_URL`: API host (default: `https://stage.blikk.tech`); the document's paths are relative to `${BLIKK_API_BASE_URL}/ecom`
- `BLIKK_FETCH_TIMEOUT`: per-request timeout in ms (default: `10000`)

## Running unit tests

Run `nx test clients-blikk` to execute the unit tests via [Jest](https://jestjs.io).
