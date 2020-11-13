# Data Providers

This library contains pre-built, reusable data providers used for the application system.

## What is an external data provider?

Many applications need to store external data that cannot be manipulated, but should be stored within the application. This data is often fetched from external sources (via x-road or other services available to island.is) and is used for either prefilling fields in the form, or for validation and information uses.

## How to create a new data provider

Create a new class which extends the `DataProvider` interface, or extends the abstract class `BasicDataProvider`.

## Running unit tests

to execute the unit tests via [Jest](https://jestjs.io)

```bash
yarn nx test application-data-providers
```

## Running lint

To lint run

```bash
yarn nx lint application-data-providers
```
