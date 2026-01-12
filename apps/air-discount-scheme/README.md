# Air Discount Scheme

## About

Generates discount codes that can be used for booking domestic flights online.

There are certain precondition to be eligible for a discount. They are:

- The person's legal domicile needs to be in a predefined set of towns outside
  the capital (We fetch postal codes from Þjóðskrá to validate if user is
  eligible).

## URLs

- [Dev](https://loftbru.dev01.devland.is)
- [Staging](https://loftbru.staging01.devland.is)
- [Production](https://loftbru.island.is)

## API

The API is used by airlines to verify the discount code validity and get basic
booking info about the user.

The airlines that have access to this api are `Icelandair`, `Ernir`, `Myflug` and
`Norlandair`. Historically some flights were booked for `Norlandair` through
`Icelandair`, those flights are marked with the `Icelandair` airline but have a
cooperation field with `Norlandair`.

[Swagger API](https://loftbru.dev01.devland.is/api/swagger)

```bash
yarn start air-discount-scheme-api
```

## Backend

The admin frontend has a view over the bookings that have been registered in
the system. This is mainly for Vegagerðin.

[Admin](https://loftbru.dev01.devland.is/admin)

```bash
yarn start air-discount-scheme-backend
```

## Web

The user frontend has information about the initiative, legal terms and a way
for users to get their discount codes.

[Dev](https://loftbru.dev01.devland.is)

```bash
yarn start air-discount-scheme-web
```

## Integrations

- [Þjóðskrá](https://skra.is): To be able to verify the persons legal domicile,
  give the airlines basic information about the person and fetch a persons
  relations to show the discount codes for related children.

## Development

To get started developing this project, go ahead and:

1. Fetch the environment secrets:

```bash
yarn get-secrets air-discount-scheme-api
yarn get-secrets air-discount-scheme-backend
yarn get-secrets air-discount-scheme-web
```

2. Start the resources with docker compose and migrate/seed the database:

```bash
yarn dev-services air-discount-scheme-backend
```

```bash
yarn nx run air-discount-scheme-backend:migrate

yarn nx run air-discount-scheme-backend:seed
```

3. Start the front end:

```bash
yarn start air-discount-scheme-web
```

4. Start the graphql api:

```bash
yarn start air-discount-scheme-api
```

5. Start the backend api:

```bash
yarn start air-discount-scheme-backend
```

6. Check Contentful and AWS

Login here <https://island-is.awsapps.com/start#/> (Contact devops if you need access)
Copy env variables as instructed [here](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting) (image arrows 1,2,3)
Paste env variables into terminal
Run `./scripts/run-es-proxy.sh` from island.is root
You have success if you see `Forwarding from 0.0.0.0:9200 -> 9200` in terminal

Navigate to [localhost:4200](http://localhost:4200) for the website or
[localhost:4248/api/swagger/](http://localhost:4248/api/swagger/) for the
airline api.

### Admin

To access the Admin UI, you'll need to add your Icelandic National ID to the
comma separated environment variable `DEVELOPERS` (.env.secret) and restart the
`api`.

```bash
export DEVELOPERS=1234567890
```

## Shortcuts

Because of the short timeline this assignment had, there were few shortcuts
taken that can be improved upon:

- The authentication is pretty primitive, the IDP is still in development at
  the time of this writing so we needed to use static api keys.
- The deployment pipeline is outside of the islandis main pipeline.
- The graphql api is separate of the main graphql api of islandis.

## Project owner

- [Vegagerðin](http://www.vegagerdin.is)

## Code owners and maintainers

- [Brian - @barabrian](https://github.com/barabrian)
- [Davíð Guðni - @dabbeg](https://github.com/dabbeg)
- [Darri Steinn - @darrikonn](https://github.com/darrikonn)
