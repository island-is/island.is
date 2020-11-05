# Environments

This document describes different environments and their purpose.

- Development environment
- Test environment (for providers of API)
- Sandbox environment (for consumers of API)
- Production environment

## Development environment

The development environment used to develop APIs should contain set of processes and programming tools to develop functional APIs. The developed assets should be connected to revision control and build processes to create a functional API. The functional API can then be deployed to other test and production environments.

## Test environment (for providers of an API)

The purpose of the test environment is to test new and changed code via either automated checks or non-automated techniques. This is to validate that the functionality of a provided API is correct before moving it to the production and sandbox environments.

This environment is not used by consumers of the API, only providers.

## Sandbox environment (for consumers of an API)

The purpose of the sandbox environment is for consumers/subscribers of an API to test and develop applications using the API. Consumers can then test their application against supported versions of the API.

Data used by an API in a sandbox environment can be either production or synthetic test data.

### Synthetic test data

Synthetic test data does not use any actual data from the production data store and sources. It is artificial data based on the data model for that database. Synthetic test data can be generated automatically by synthetic test data generation.

### Production test data

Production test data is a copy of a production database that has been masked, or obfuscated, and subsetted to represent a portion of the database that is relevant to test the API.

## Production environment

The live system hosting the API. Consumers of APIs use this environment to call APIs with live authentication and actual data.
