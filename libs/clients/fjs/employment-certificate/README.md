# @island.is/clients/fjs/employment-certificate

NestJS client for the employment-certificate API ("Job History Certificate API", v4.0.0) of Fjársýsla ríkisins (the Financial Management Authority). The employment certificate application (`libs/application/templates/fjs/employment-certificate`) uses it to check whether a person has employment history with government institutions, to show that history and to request the certificate.

## What the API does

Every call is made as the logged-in person. The API reads the person from their IAS access token and takes no national ID. Only individuals acting for themselves are supported: no delegations and no machine tokens.

| Method           | API call                              | What it does                                                                                                    |
| ---------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `getEligibility` | `GET /employment-history/eligibility` | `{ hasEmploymentHistory }`: true exactly when the preview would list at least one institution. Creates nothing. |
| `getPreview`     | `GET /employment-history/preview`     | The institutions (`id`, `name`, `from`, `to`) in certificate order, and the `previewVersion`. Creates nothing.  |
| `submitRequest`  | `POST /employment-history/requests`   | Requests the certificate for the chosen institutions, with the union choice and an optional comment.            |

- The API's schema marks nothing in its answers as required. The service fills defaults and returns types with required fields. A preview without `previewVersion`, or an institution without `id`, is an unusable answer.
- `submitRequest` answers `201` with `sent_to_mailbox` and a `documentId` (the Digital Mailbox document), or `202` with `processing`, or `closed` when a key is replayed for a case staff have closed. The answer never says whether staff handle the request.
- The comment is sent trimmed and only when it isn't blank: the API treats a blank comment as absent but rejects `null`. Its limit is 4,000 characters after trimming.
- `submitRequest` needs an `idempotencyKey`: one per application, reused on retries and token refresh. A repeated key replays the stored case; the same key with a different body is `409`. Not yet confirmed with Fjársýsla ríkisins: whether a key that got a `409 preview_changed` can be sent again with the new `previewVersion`.
- The API also has `GET /employment-history/requests/{caseId}/status`. The application doesn't check the status after submitting, so the client has no method for it.
- Enhanced Fetch never retries by itself.

## Errors

Failed calls throw `FetchError`, as in other clients. The API answers errors with plain JSON, `{ code?, error, requestId }`, so `FetchError.problem` is never set. Read the answer with the helper:

```typescript
try {
  await client.submitRequest(user, input)
} catch (error) {
  const problem = await getEmploymentCertificateClientProblem(error)
  if (isPreviewChanged(problem)) {
    // 409 preview_changed: fetch the history again and let the person check it
  }
  throw error
}
```

Documented answers of `POST /requests`, checked in this order:

| Status | Code              | Meaning                                                                              |
| ------ | ----------------- | ------------------------------------------------------------------------------------ |
| `409`  |                   | The same `Idempotency-Key` was sent with a different body.                           |
| `404`  |                   | The person has no history. No case is created.                                       |
| `409`  | `preview_changed` | The history changed after the preview. No side effects.                              |
| `400`  |                   | An unknown institution ID (or another invalid request).                              |
| `413`  |                   | The body is too large.                                                               |
| `500`  |                   | For example a signing failure before the request is stored. Retry with the same key. |

All endpoints can also answer `400`, `401` and `500`.

- The helper returns `{ status, code, requestId }`, or `null` when the API gave no answer (timeout, network error, open circuit breaker).
- The free-text `error` field is left out on purpose, and Enhanced Fetch is set up not to log error bodies. `requestId` is safe to log.
- `EmploymentCertificateClientNotConfiguredError` is thrown before any request when the configuration can't be used: no base URL, a direct URL that isn't `https` (or `http://localhost`), or a scope without a configured IAS client. The client never falls back to forwarding the person's own token when a scope is set.

## Configuration

Every variable is optional. The module only needs the standard X-Road base configuration (`XROAD_BASE_PATH`, `XROAD_CLIENT_ID`), which apps that use X-Road already have, so loading it never stops an app from starting.

| Variable                                   | Use                                                                                                                                    |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `XROAD_FJS_EMPLOYMENT_CERTIFICATE_PATH`    | X-Road service path. The service isn't registered in X-Road yet, so there is no default.                                               |
| `FJS_EMPLOYMENT_CERTIFICATE_DIRECT_URL`    | Base URL of the API for calling it directly, without X-Road. Local development only; ignored when `NODE_ENV` is `production`.          |
| `XROAD_FJS_EMPLOYMENT_CERTIFICATE_SCOPE`   | Comma-separated IAS scopes. When set, the person's token is exchanged for one with these scopes. When empty, their token is forwarded. |
| `XROAD_FJS_EMPLOYMENT_CERTIFICATE_TIMEOUT` | Request timeout in milliseconds. Default `20000`.                                                                                      |

The direct URL wins over the X-Road path. The base URL of the test API isn't in this repository; ask the team that maintains the application.

### When the X-Road service exists

- Give `XROAD_FJS_EMPLOYMENT_CERTIFICATE_PATH` a dev default in `src/lib/employment-certificate.config.ts`.
- Add the per-environment paths to the infrastructure of the apps that use the client, and run `yarn charts`.
- Switch `update-openapi-document` in `project.json` to fetch the spec through X-Road, as other clients do.

## Usage

```typescript
import { EmploymentCertificateClientModule } from '@island.is/clients/fjs/employment-certificate'

@Module({
  imports: [EmploymentCertificateClientModule],
})
export class SomeModule {}
```

Load `EmploymentCertificateClientConfig` and `XRoadConfig` in the app's `ConfigModule.forRoot`, as the application-system API does in `apps/application-system/api/src/app/app.module.ts`.

## Updating the OpenAPI spec

The spec (`src/clientConfig.json`, Swagger 2.0) is fetched straight from the API, which needs network access to it:

```bash
export FJS_EMPLOYMENT_CERTIFICATE_DIRECT_URL=<base URL of the API>
yarn nx run clients-fjs-employment-certificate:update-openapi-document
```

Review the diff before regenerating. The spec has no `operationId`s, so the generated function names come from the paths and change when a path changes.

## Regenerating the client

```bash
yarn nx run clients-fjs-employment-certificate:codegen/backend-client
```

The client is generated with `@hey-api/openapi-ts` into `gen/fetch`, which isn't checked in. openapi-ts is used because the `POST` endpoints answer `201` or `202` with different bodies.

## Running unit tests

```bash
yarn nx test clients-fjs-employment-certificate
```
