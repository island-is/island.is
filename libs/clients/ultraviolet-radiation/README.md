# Ultraviolet radiation client

This generated client calls a web service that belongs to the Icelandic Radiation Safety Authority

## Updating the open api definition (clientConfig.json)

```sh
yarn nx run clients-ultraviolet-radiation:update-openapi-document --args="--apiKey=INSERT_API_KEY_HERE"
```

## Regenerating the client:

```sh
yarn nx run clients-ultraviolet-radiation:codegen/backend-client
```
