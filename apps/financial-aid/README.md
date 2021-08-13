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

### File upload locally

To test/develop file upload locally you will need to set the secrets: `process.env.CLOUDFRONT_PUBLIC_KEY_ID` and `process.env.CLOUDFRONT_PRIVATE_KEY` in your .env file.

Then you need to turn off web safety, we use the following command: `open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security`, to turn web safety back on you need to restart Chrome.

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri-robin-hood)
