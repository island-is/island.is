# Financial Aid System for Samband Sveitarfélaga

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

To test authentication locally:

- `npm install -g local-ssl-proxy`
  downloads https://github.com/cameronhunter/local-ssl-proxy
- change
  const defaultCookieOptions: CookieOptions = {
  secure: true,
  }
  in file island.is/apps/financial-aid/api/src/app/modules/auth/auth.controller.ts
- add .env to web project change port
- start project
- 'local-ssl-proxy --source 4200 --target 4202'
