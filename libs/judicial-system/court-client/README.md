```markdown
# judicial-system-court-client

This library is designed for integration with the Icelandic Court System, known as Auður.

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the following command:

```bash
nx test judicial-system-court-client
```

## Client Generation

To generate the client, execute the following command:

```bash
./node_modules/.bin/openapi-generator-cli generate -g typescript-fetch --additional-properties=typescriptThreePlus=true -o libs/judicial-system/court-client/gen/fetch -i libs/judicial-system/court-client/src/clientConfig.json
```

## Updating the Client

To update the client:

1. Obtain a new OpenAPI JSON description and replace the content of `./src/clientConfig.json`.
2. Generate the client by running the command provided in the "Client Generation" section.
3. Update `./src/lib/courtClient.service.ts` as needed. Note that in the current implementation, `UploadStream` has been removed from `./src/clientConfig.json` and implemented manually.
```