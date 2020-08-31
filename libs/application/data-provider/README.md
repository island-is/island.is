# application-data-provider

This library contains utilities and all external data providers used for the application system.  

## What is an external data provider?

Many applications need to store external data that cannot be manipulated, but should be stored within the application. This data is often fetched from external sources (via x-road or other services available to island.is) and is used for either prefilling fields in the form, or for validation and information uses. 

## How to create a new data provider

Add a unique type for the data provider to `DataProvider.ts`. Then create a new class inside `data-provider/src/providers/` which extends the abstract class `DataProvider`.  

## Running unit tests

Run `yarn nx test application-data-provider` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `yarn nx lint application-data-provider` to lint
