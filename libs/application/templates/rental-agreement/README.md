# Rental Agreement application

## About

This application allows individuals to create a rental agreement between one or more landlords and tenants that ends in a signature of all required parties and is then registered with the rental registry (leiguskrá Húsnæðis- og Mannvirkjastofnunar).

## URLs

> [!NOTE]
> Project is still only on DEV.

- [Dev](https://rental-agreement-application-beta.dev01.devland.is/umsoknir/leigusamningur)
- [Staging](https://beta.staging01.devland.is/umsoknir/leigusamningur)
- [Production](https://island.is/umsoknir/leigusamningur)

## Setup

Follow [this guide](https://docs.devland.is/development/getting-started) to set up the application system startup environment

## Running locally

### AWS secrets

Get the AWS environment variables from https://island-is.awsapps.com/start to be able to upload documents while running locally

- Choose island-is-development01 --> Access Keys
- Copy AWS environment variables under "Option 1: Set AWS environment variables"
- Paste in terminal before running each of:

```bash
kubectl -n socat port-forward svc/socat-xroad 8080:80
```

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

```bash
kubectl port-forward svc/socat-soffia 8443:443 -n socat
```

### Docker containers:

- islandis-shared --> redis_cluster
- islandis-application-system --> db_application_system
- user-profile --> db_user_profile

### Start dev services:

In terminal log in to AWS:

```bash
aws sso login
```

then run the server:

```bash
yarn start application-system-form
```

and visit `http://localhost:4242/umsoknir/leigusamningur`

## Test users

You can use any gervimaður to go through the appplication on DEV

### Localisation

When creating new text strings or making changes in the messages.ts file for the application, be sure to update Contentful by running:

```bash
yarn nx run application-templates-rental-agreement:extract-strings
```

For more info see [message extraction](../../../localization/README.md#message-extraction).

## Project owner

- [Húsnæðis- og mannvirkjastofnun](http://www.hms.is)

## Code owners and maintainers

- [Kolibri Kotid](https://github.com/orgs/island-is/teams/kolibri-kotid)
