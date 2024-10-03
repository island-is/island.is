````markdown
# Financial Aid System for Samband Sveitarfélaga

This is the financial aid system created for Samband Sveitarfélaga by Kolibri.

The system consists of one API, one backend, and two clients called Ósk and Veita.

## Initial Setup

Ensure Docker is installed, then execute:

- `yarn dev-services financial-aid-backend`

Run migrations and seed the database:

- `yarn nx run financial-aid-backend:migrate`
- `yarn nx run financial-aid-backend:seed`

### Running Locally

Start the backend:

- `yarn start financial-aid-backend`

Start the API:

- `yarn start financial-aid-api`

Start the Veita client:

- `yarn start financial-aid-web-veita`

To start Ósk (note: Ósk is deprecated):

- `yarn start financial-aid-web-osk`

  **Note:** The "Ósk" application is located in the application system. Reference the documentation here: [Application System Documentation](https://github.com/island-is/island.is/blob/cde4392eda5b82877dd2f79fd1854f6f4fb2a09e/apps/application-system/README.md?plain=1#L3)

Visit [localhost:4200](http://localhost:4200).

## Testing Authentication Locally

To sign in, set the following environment variables:

- `NEXTAUTH_URL=http://localhost:4200`
- `IDENTITY_SERVER_DOMAIN=identity-server.dev01.devland.is`
- `IDENTITY_SERVER_SECRET` - Obtain a client secret for the `@samband.is/financial-aid` client.

Use Gervimaður Færeyjar (0102399) to sign in to Veita.

For HTTPS support, install [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy):

- `npm install -g local-ssl-proxy`

Modify the `defaultCookieOptions` in `financial-aid/api/src/app/modules/auth/auth.controller.ts`:

```typescript
const defaultCookieOptions: CookieOptions = {
  secure: true,
}
```
````

Create a `.env` file in the web project and change the port to 4202. Start the project and run:

- `local-ssl-proxy --source 4200 --target 4202`

### File Upload Locally

To test or develop file uploads locally, set the secrets `process.env.CLOUDFRONT_PUBLIC_KEY_ID` and `process.env.CLOUDFRONT_PRIVATE_KEY` in your `.env` file.

Disable web security in Chrome with the following command:

```bash
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

Restart Chrome to re-enable web security.

## Connecting to X-Road

To use the national registry service, execute:

```bash
.api/scripts/run-xroad-proxy.sh
```

Ensure these environment variables are set: `XROAD_BASE_PATH_WITH_ENV`, `XROAD_TJODSKRA_MEMBER_CODE`, `XROAD_TJODSKRA_API_PATH`, and `XROAD_CLIENT_ID`.

## Code Owners and Maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri-robin-hood)

```

```
