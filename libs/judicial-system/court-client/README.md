````markdown
# Judicial System Court Client

This library facilitates integration with the Icelandic Court System, known as Auður.

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the following command:

```bash
nx test judicial-system-court-client
```
````

## Generating the Client

To generate the TypeScript client, execute the following command:

```bash
./node_modules/.bin/openapi-generator-cli generate \
  -g typescript-fetch \
  --additional-properties=typescriptThreePlus=true \
  -o libs/judicial-system/court-client/gen/fetch \
  -i libs/judicial-system/court-client/src/clientConfig.json
```

## Updating the Client

To update the client, follow these steps:

1. Obtain a new OpenAPI JSON description and replace the content of `./src/clientConfig.json` with this new data.
2. Re-run the command from the "Generating the Client" section to regenerate the client.
3. Manually update `./src/lib/courtClient.service.ts` if necessary.
   - Note: The `UploadStream` feature has been implemented manually and should be excluded from `./src/clientConfig.json`.

```

```
