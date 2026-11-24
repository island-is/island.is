# Icelandic Health Insurance (Sjúkratryggingar) Speech Therapy Client

## About

This library implements a client for Sjúkratryggingar's speech therapy waiting list API (the `speech` X-Road service). It is used by the [speech therapy waiting list registration](../../../application/templates/iceland-health/speech-therapy-waiting-list-registration) application.

The client is generated from a copy of the OpenAPI document provided by Sjúkratryggingar. The document describes the whole service, but only the `/v1/digital-iceland` endpoints are open to island.is through X-Road, so the module only provides `DigitalIcelandApi`.

## Configuration

| Environment variable                            | Description                                                   |
| ----------------------------------------------- | ------------------------------------------------------------- |
| `XROAD_HEALTH_INSURANCE_SPEECH_THERAPY_PATH`    | X-Road path to the `speech` service. Defaults to dev.          |
| `XROAD_HEALTH_INSURANCE_SPEECH_THERAPY_API_KEY` | Sent in the `ApiKey` header. Fetched with `yarn get-secrets`.  |

Calls use token exchange with the `@sjukra.is/speech-waiting-list` scope (`SjukraScope.speechWaitingList`).

## Usage

### Updating the open api definition (clientConfig.json)

The OpenAPI document is not available through X-Road. Download it from Sjúkratryggingar's API portal as "Open API 3 (JSON)" and replace `src/clientConfig.json`.

### Regenerating the client

```sh
yarn nx run clients-speech-therapy:codegen/backend-client
```

## Code owners and maintainers

- [Deloitte](https://github.com/orgs/island-is/teams/deloitte)
