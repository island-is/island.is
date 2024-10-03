# Consultation Portal

## About

The Consultation Portal aims to increase transparency and facilitate public and stakeholder participation in policy-making, regulations, and decision-making by public authorities.

In the Consultation Portal, you can find legislative plans, drafts of bills and regulations, strategic planning documents (e.g., draft policies), and more. Users can submit comments or suggestions and subscribe to automatic notifications for updates on specific topics, organizations, or issues.

To submit a comment, suggestion, or subscribe to notifications, users must log in using their "electronic ID" credentials.

## URLs

The frontend can be accessed through the following URLs. The backend is hosted externally but maintained by Advania.

- [Development](https://beta.dev01.devland.is/samradsgatt)
- [Production](https://island.is/samradsgatt)

## Getting Started

### Development

1. Fetch the environment variables for both the frontend and the API. Follow [this guide](https://docs.devland.is/repository/aws-secrets#usage-to-fetch-secrets) to fetch secrets for the first time.

   ```bash
   yarn get-secrets consultation-portal
   ```

   ```bash
   yarn get-secrets api
   ```

2. The project uses `next-auth` for authentication. To run the project, you must either export the `NEXTAUTH_URL` or add it to a `.env` file.

   ```bash
   export NEXTAUTH_URL=http://localhost:4200/samradsgatt/api/auth
   ```

3. Run `yarn` to install the necessary packages.

   ```bash
   yarn
   ```

4. Run `codegen` to auto-generate API schemas and clients.

   ```bash
   yarn codegen
   ```

5. Start the API that fetches data from the backend and serves it to the frontend.

   ```bash
   yarn start api
   ```

6. Run the frontend in a separate terminal from the backend.

   ```bash
   yarn start consultation-portal
   ```

7. Navigate to [http://localhost:4200/samradsgatt](http://localhost:4200/samradsgatt).

8. Visit the [GraphQL playground](http://localhost:4200/api/graphql).

9. To use the upload feature, export AWS credentials.

   - Login at <https://island-is.awsapps.com/start#/> (Contact DevOps for access).
   - Follow the instructions [here](https://docs.devland.is/technical-overview/devops/dockerizing#troubleshooting) (see image arrows 1, 2, 3).
   - Paste the environment variables into the terminal.

## Project Owner

- [Stjórnarráðið](https://www.stjornarradid.is)

## Code Owners and Maintainers

- [Advania](https://www.advania.is)
- [Gladvania-in-Wonderland](https://github.com/orgs/island-is/teams/gladvania-in-wonderland)
