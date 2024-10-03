# Financial Aid System for Samband Sveitarfélaga

This is the financial aid system created for Samband Sveitarfélaga by Kolibri.

The system is one api, one backend and two clients called Ósk and Veita.

## Initial Setup

First, make sure you have docker, then run:

- `yarn dev-services financial-aid-backend`

Run migrations and seed:

- `yarn nx run financial-aid-backend:migrate`
- `yarn nx run financial-aid-backend:seed`

### Running locally

Run backend:

- `yarn start financial-aid-backend`

Run api:

- `yarn start financial-aid-api`

Run Veita client:

- `yarn start financial-aid-web-veita`

Run Ósk:

- `yarn start financial-aid-web-osk`
  NOTE web-osk is not in use anymore
  The application ósk is in the application system
  For documentation look here <https://github.com/island-is/island.is/blob/cde4392eda5b82877dd2f79fd1854f6f4fb2a09e/apps/application-system/README.md?plain=1#L3>

Go to localhost:4200.

## To test authentication locally

To sign in you'll need to configure these environment variables:

- `NEXTAUTH_URL=http://localhost:4200`
- `IDENTITY_SERVER_DOMAIN=identity-server.dev01.devland.is`
- `IDENTITY_SERVER_SECRET=` - get a client secret for the `@samband.is/financial-aid` client.

You can sign in to Veita using Gervimaður Færeyjar (0102399).

If you need https, you can install <https://github.com/cameronhunter/local-ssl-proxy>:

- `npm install -g local-ssl-proxy`

- change defaultcookie in financial-aid/api/src/app/modules/auth/auth.controller.ts:

  const defaultCookieOptions: CookieOptions = {
  secure: true,
  }

- add .env to web project and change port to 4202
- start project
- `local-ssl-proxy --source 4200 --target 4202`

### File upload locally

To test/develop file upload locally you will need to set the secrets: `process.env.CLOUDFRONT_PUBLIC_KEY_ID` and `process.env.CLOUDFRONT_PRIVATE_KEY` in your .env file.

Then you need to turn off web safety, we use the following command: `open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security`, to turn web safety back on you need to restart Chrome.

## How to connect to X-Road

To use national registry service you need to run:

```bash
  .api/scripts/run-xroad-proxy.sh
```

and make sure the environment variables `XROAD_BASE_PATH_WITH_ENV`, `XROAD_TJODSKRA_MEMBER_CODE`, `XROAD_TJODSKRA_API_PATH` and `XROAD_CLIENT_ID` are available.

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri-robin-hood)
