# Consultation Portal

## About

The Consultation Portal aims to enhance transparency and public participation in policy-making, regulations, and decision-making by public bodies.

The portal includes legislative plans, draft bills, regulations, strategic planning documents, and more. Users can comment, suggest, and subscribe to updates by topic, organization, or issue using their electronic ID.

## URLs

The frontend URLs for access are below, while the backend is hosted externally by Advania.

- [Dev](https://beta.dev01.devland.is/samradsgatt)
- [Production](https://island.is/samradsgatt)

## Getting Started

### Development

1. Fetch environment variables for the frontend and API. Refer to [this guide](https://docs.devland.is/repository/aws-secrets#usage-to-fetch-secrets) for retrieving secrets initially.

   ```bash
   yarn get-secrets consultation-portal
   yarn get-secrets api
   ```

2. Export the `NEXTAUTH_URL` or add it to a `.env` file for NextAuth authentication.

   ```bash
   export NEXTAUTH_URL=http://localhost:4200/samradsgatt/api/auth
   ```

3. Install necessary packages.

   ```bash
   yarn
   ```

4. Auto-generate API schemas and clients.

   ```bash
   yarn codegen
   ```

5. Launch the backend API.

   ```bash
   yarn start api
   ```

6. In a separate terminal, start the frontend.

   ```bash
   yarn start consultation-portal
   ```

7. Open [localhost:4200/samradsgatt](http://localhost:4200/samradsgatt).

8. Access the [GraphQL playground](http://localhost:4200/api/graphql).

9. Export AWS credentials for the upload feature.

   - Login [here](https://island-is.awsapps.com/start#/). Contact DevOps for access.
   - Copy environment variables as instructed [here](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting) (see image arrows 1, 2, 3).
   - Paste variables into the terminal.

## Project Owner

- [Stjórnarráðið](https://www.stjornarradid.is)

## Code Owners and Maintainers

- [Advania](https://www.advania.is)
- [Gladvania-in-wonderland](https://github.com/orgs/island-is/teams/gladvania-in-wonderland)
