````markdown
# Ultraviolet Radiation Client

This generated client interacts with a web service provided by the Icelandic Radiation Safety Authority.

## Updating the OpenAPI Definition (clientConfig.json)

To update the OpenAPI definition, execute the following command. Remember to replace `INSERT_API_KEY_HERE` with your actual API key.

```sh
yarn nx run clients-ultraviolet-radiation:update-openapi-document --args="--apiKey=INSERT_API_KEY_HERE"
```
````

## Regenerating the Client

To regenerate the client code after updating the OpenAPI definition, use the following command:

```sh
yarn nx run clients-ultraviolet-radiation:codegen/backend-client
```

```

```
