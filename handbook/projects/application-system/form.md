# Application system form - Frontend app

This app contains the frontend app for the application system

## Running locally

You can serve this app locally by running:

`yarn nx serve application-system-form`

The only backend apps this app depends on are the graphql api and the application-system-api. Therefore, make sure you run those as well:

`yarn nx serve application-system-api` (see `apps/application-system/api/README.md` if you run into any problems here)

and

`yarn nx serve api`

## Testing

It is as simple as: `yarn nx test application-system-form`
