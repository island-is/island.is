# api-domains-ship-registry

GraphQL API domain for Icelandic Ship Registry data.

## Overview

This module provides GraphQL resolvers and services for accessing ship registry information from the Icelandic Ship Registry (Skipaskrá). It includes functionality for both public ship searches and authenticated user-specific ship queries.

## Features

### Public Ship Search

- **Query**: `shipRegistryShipSearch`
- Search for ships by name or registration number
- No authentication required

### User Ships (Authenticated)

- **Queries**:
  - `shipRegistryUserShips` - Get all ships associated with the current user
  - `shipRegistryUserShip` - Get a specific ship by ID
- Requires authentication with `internal` scope
- Protected by feature flag: `isServicePortalUserShipsPageEnabled`

## Module Structure

- **Resolvers**: `ShipRegistryResolver`, `UserShipsResolver`
- **Services**: `UserShipsService`
- **Clients**: Integrates with `@island.is/clients/ship-registry` and `@island.is/clients/ship-registry-v2`

## Running unit tests

Run `nx test api-domains-ship-registry` to execute the unit tests via [Jest](https://jestjs.io).
