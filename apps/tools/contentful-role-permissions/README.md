# Contentful role permissions

## What

- This is a dev tool used to manage Contentful role permissions.
- This allows developers to [manage roles](https://www.contentful.com/developers/docs/tutorials/general/roles-via-api/) via a website interface using the content management API provided by Contentful

## Why

- This was developed to help us manage users in Contentful since the Contentful UI for managing role policies was limited (at the time of writing this)

## How to run

- You need a contentful management api key that's exported in your `.env.secret` file
- Like so: `export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=insert-api-key-here`
- Then you can run the application using the following command
- `yarn start contentful-role-permissions`
- Then you'll be able to access a website at `http://localhost:4200`

## Code owners and maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
