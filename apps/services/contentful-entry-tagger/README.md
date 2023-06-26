# Contentful Entry Tagger

## About

This service will add a tag to newly created entry if the entry was created by a user with a space role that has the prefix "Owner-".
This is done so we can manage user permissions in Contentful, we do so via tags and roles.

## Getting started

To start the service you run `yarn start services-contentful-entry-tagger`. This starts a server on `localhost:3333`.

The indexer server currently has only one endpoint:

- `POST /api/entry-created` This is an endpoint that Contentful calls when an entry gets created

## Code owners and maintainers

- [Stefna](https://github.com/orgs/island-is/teams/stefna/members)
