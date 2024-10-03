# Ultraviolet Radiation Client

This client interacts with the web service provided by the Icelandic Radiation Safety Authority.

## Update OpenAPI Definition (`clientConfig.json`)

To update the OpenAPI definition, run the following command:

```sh
yarn nx run clients-ultraviolet-radiation:update-openapi-document --args="--apiKey=INSERT_API_KEY_HERE"
```

## Regenerate the Client

To regenerate the client, execute:

```sh
yarn nx run clients-ultraviolet-radiation:codegen/backend-client
```
