# Contentful GraphQL Client

## About

This library implements a GraphQL client to interact with Contentful's GraphQL APIs.

## Configuration

The following environment variables need to be configured:

- `CONTENTFUL_API_KEY`: Your Contentful API key.
- `CONTENTFUL_SPACE_ID`: Your Contentful space ID.
- `CONTENTFUL_ENVIRONMENT`: Your Contentful environment (default is `master`).

## Usage

To use the Contentful client, import the `ContentfulClientModule` into your NestJS application and inject the `ContentfulClientService` to interact with the API.

## Running Unit Tests

Run `nx test contentful-graphql-client` to execute the unit tests via [Jest](https://jestjs.io).

## Code Generation

To generate the necessary GraphQL types and queries, use `graphql-codegen` and configure it in `codegen.yaml`.

## Maintainers

- Your Team
