# BFF (Backend for Frontend)

## About

The BFF (Backend for Frontend) service serves as an intermediary layer for multiple clients, such as the admin portal, service portal, and other applications. It is designed to centralize authentication and business logic, ensuring a secure and streamlined communication process between clients and backend resources.

This service handles user authentication through our IdentityServer, facilitating secure access and session management. Once authenticated, the BFF proxies and manages requests to our GraphQL API, ensuring only authorized requests are processed.

## Getting Started

To set up and run the BFF service, use the following commands:

### Start Development Server
jfea
`yarn start services-bff`
Starts the service on `localhost:3010`.

### Build for Production

`yarn nx build services-bff`
Builds the service to `dist/apps/services/bff`.
For production: `nx build services-bff --configuration=production`

### Lint Code

`yarn nx lint services-bff`

### Run Tests

`yarn nx test services-bff`
Runs tests with Jest and outputs coverage to `coverage/apps/services/bff`.

### Starts Redis server with Docker

`yarn nx dev-services services-bff`

## Code owners and maintainers

- [Aranja](https://github.com/orgs/island-is/teams/aranja/members)

## Troubleshooting

If you encounter any issues while setting up or running the BFF service, please refer to the [Troubleshooting Guide](TROUBLESHOOT_GUIDE.md)
