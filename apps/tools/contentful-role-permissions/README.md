<!-- gitbook-ignore -->

# Contentful Role Permissions

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

## Important information

- We use roles and tags to manage users in Contenful, meaning that each role has a corresponding tag
- For organizations the role name is essentially the same as the tag name, that's how we map them together (to be exact the slugified version of the role name must match some tag name)
  - For example, the role name: `Owner-Fiskistofa` and the tag name: `owner-fiskistofa` are connected
  - So each time a user with the role `Owner-Fiskistofa` creates an entry, it'll automatically be tagged with the tag name: `owner-fiskistofa` and other users with the same role can also see that entry

## Code owners and maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
