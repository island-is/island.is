# Financial aid system for Samband Sveitarfélaga

This is the financial aid system created for Samband Sveitarfélaga by Kolibri.

The system is one api, one backend and two clients called Ósk and Veita.

## Initial Setup

First, make sure you have docker, then run:

- `yarn dev-services financial-aid-backend`

Run migrations:

- `yarn nx run financial-aid-backend:migrate`

### Running locally

Run backend:

- `yarn start financial-aid-backend`

Run api:

- `yarn start financial-aid-api`

Run Ósk or Veita client:

- `yarn start financial-aid-web-osk`
- `yarn start financial-aid-web-veita`

Go to localhost:4200

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri-robin-hood)
