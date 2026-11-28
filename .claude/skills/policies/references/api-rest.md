# REST APIs (REST)

Sources: [API design guide](https://docs.devland.is/technical-overview/api-design-guide.md), [Naming](https://docs.devland.is/technical-overview/api-design-guide/naming-conventions.md), [Errors](https://docs.devland.is/technical-overview/api-design-guide/errors.md), [Pagination](https://docs.devland.is/technical-overview/api-design-guide/pagination.md), [Versioning](https://docs.devland.is/technical-overview/api-design-guide/versioning.md), [Data definitions](https://docs.devland.is/technical-overview/api-design-guide/data-definitions.md), [OpenAPI](https://docs.devland.is/development/openapi.md)

- **REST-1** Paths are `/v1/...`: lowercase, hyphenated, plural collection nouns; camelCase query parameters and JSON fields.
- **REST-2** Custom actions use `POST /resource/:id/<verb>`.
- **REST-3** Responses are a top-level object, never a bare array.
- **REST-4** Errors are RFC 7807 `application/problem+json` (`type`, `title`, `status`, optional `detail`). Use the shared problem filters, not ad-hoc error shapes.
- **REST-5** List endpoints use cursor pagination (`libs/nest/pagination`: `limit` with `before`/`after`).
- **REST-6** Breaking changes go to a new major version. The old version gets at least six months' notice before removal.
- **REST-7** Formats: national IDs are 10 digits without a hyphen; dates are RFC 3339; languages ISO 639-1; currencies ISO 4217.
- **REST-8** Every operation, parameter and field has an OpenAPI description, plus examples and all response status codes.
- **REST-9** Missing or forbidden single resources: the guide says 204, but most services return 404/403. Follow the service you're in and be consistent.
- **REST-10** External services are reached through X-Road or a generated client in `libs/clients/*`, not ad-hoc `fetch` calls.
