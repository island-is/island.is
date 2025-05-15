# Consultation Portal

## About

The aim of the consultation portal is to increase transparency and the possibility for the public and interested parties to participate in policy-making, regulations and decision-making by public bodies.

In the consultation portal, you can find plans for legislation, drafts of bills and regulations, documents on strategic planning (eg draft policies) and more. You can submit a comment or suggestion, and it is also possible to subscribe to automatic monitoring of information, whether by subject area, organization or specific issue.

To be able to submit a comment or suggestion and subscribe to automatic monitoring, the user needs to use his "electronic ID" credentials.

## URLs

The frontend can be accessed through the following urls, the backend is hosted externally but maintained by Advania.

- [Dev](https://beta.dev01.devland.is/samradsgatt)
- [Production](https://island.is/samradsgatt)

## Getting started

### Development

1. Fetch the environment variables for both the frontend and the api. [This guide](https://docs.devland.is/repository/aws-secrets#usage-to-fetch-secrets) shows how you can fetch secrets for the first time.

```bash
    yarn get-secrets consultation-portal
```

```bash
    yarn get-secrets api
```

2. The project uses next-auth authentication and in order to run the project you either need to export the NEXTAUTH_URL or add it to a .env file in the project.

```bash
    export NEXTAUTH_URL=http://localhost:4200/samradsgatt/api/auth
```

3. Run yarn to install the necessary packages for the project.

```bash
    yarn
```

4. Run codegen to auto generate API schemas and clients.

```bash
    yarn codegen
```

5. Run the api that fetches data from the backend and feeds the frontend.

```bash
    yarn start api
```

6. Run the frontend in a seperate terminal from the backend

```bash
    yarn start consultation-portal
```

7. Navigate to [localhost:4200/samradsgatt](http://localhost:4200/samradsgatt)

8. Navigate to the [graphql playground](http://localhost:4200/api/graphql)

9. Note that in order to use the upload feature you need to export the aws credentials.

Login here https://island-is.awsapps.com/start#/ (Contact devops if you need access)
Copy env variables as instructed [here](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting) (image arrows 1,2,3)
Paste env variables into terminal

## Project owner

- [Stjórnarráðið](https://www.stjornarradid.is)

## Code owners and maintainers

- [Advania](https://www.advania.is)
- [Gladvania-in-wonderland](https://github.com/orgs/island-is/teams/gladvania-in-wonderland)
