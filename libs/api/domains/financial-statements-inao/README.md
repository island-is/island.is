```markdown
# Financial Statements for the Icelandic National Audit Office (INAO)

This endpoint provides access to financial statements for cemeteries, political parties, and individuals involved in personal elections who submit their financial statements to the Icelandic National Audit Office (Ríkisendurskoðun). These entities are exempt from submitting their financial statements to the Icelandic Revenue and Customs (Skatturinn).

The endpoint serves as an integration point between an application template used to retrieve these financial statements and an Office365 application hosted in the cloud.

## Running Unit Tests

To execute unit tests, run the following command: 

```bash
yarn test api-domains-financial-statements-inao
```

The tests are powered by [Jest](https://jestjs.io), a delightful JavaScript testing framework.
```