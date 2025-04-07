# Payments web app

This application gives users the ability to pay for products offered by organizations.

Payment flows can be initialised by calling the payments microservice (apps/services/payments/README.md).

## Local development

- `payments` is the web application that renders the payment flows to the end user
- `payments` communicates with `api`
- `api` communicates with `services-payments` through `clients-payments`
- `clients-payments` uses openapi code generation from `services-payments` with [custom configuration](libs/clients/payments/src/lib/payments-client.config.ts)

### Prerequisites

`yarn`

#### Code generation

`yarn codegen`

#### Initialise the payments microservice

`yarn nx run services-payments:dev-init`

### Start

To develop this application locally you need to start a few processes

- `yarn start payments`
- `yarn start services-payments`
- `yarn proxies xroad`
- `yarn start api`
