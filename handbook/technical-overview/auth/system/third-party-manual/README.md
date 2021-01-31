# Third Party's Development Manual

## Table of Content

1. [Audience](#audience)

2. [Development](#development)

3. [Protocols](#protocols)

- 3.1. [NestJS:](#nestjs)

- 3.2. [NetCore](#netcore)

- 3.4 [Angular](#angular)

- 3.5 [React](#react)

- 3.6 [Next.js](#nextjs)

4. [Info links](#info-links)

- 4.1 [Angular:](#angular-link)

- 4.2 [React](#react-link)

- 4.3 [NestJS:](#nestjs-link)

## <a name="audience"></a>Audience

This manual is written for customers of [Digital Iceland](https://island.is/)'s authentication system.

Customers of the authentication system are considered any third-party agent with an administrative authority over the web/system of the appropriate institutions (owners, authorized signatories) and the technical teams of the appropriate institutions (programmers, service- and hosting providers).

## <a name="development"></a>Development

The authentication system uses _OpenID Connect provider_ which implements _OpenID_ and _OAuth 2.0_ protocols.

For further information about the _OAuth 2.0_ standards follow this link: <https://oauth.net/2/>

## <a name="protocols"></a>Protocols:

Following are some sample projects implemented to show third-party developers how to connect to the authentication system in various languages and platforms.
An overview of all the sample projects can also be seen in this repository:
<https://github.com/island-is/identity-server.samples>.
All the sample projects talk to the island.is sandbox for the authentication system.
All the projects are setup so that to change the connection from the sandbox to the real authentication system you only need to change environment variables.
<https://github.com/island-is/identity-server.sandbox>

- ### <a name="nestjs"></a>NestJS:

  We implemented two different **NestJS** services that use [island.is](https://island.is/) authentication service.

  1.  A service with an implemented "Jwt" auth-guard with a registered audience to island.is authentication service that can be added as a guard to controllers or functions, meaning that it´s only possible for tokens issued by [island.is](https://island.is/) authentication service with a specific scope to call those controllers or functions.
      It comes implemented with the OpenApi specification using _Swagger_ and the _Swagger Authorization_ functionality so that you can generate tokens from [island.is](https://island.is/) authentication service using _Swagger_ and call the functions in the service without getting a 401 code.
      <https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/nestjs>

  2.  A service that is not protected by an oidc-provider but implements a call to a demo service that uses [island.is](https://island.is/) authentication service as an oidc-provider. To do that the service needs to call the island.is authentication service to get a _client_credentials_ token. The purpose of this service is to show the implementation of how to get a _client_credentials_ token from the [island.is](https://island.is/) authentication service using _NestJS_.
      It comes implemented with the _OpenApi_ specification using _Swagger_ but not the _Swagger Authorization_ functionality.
      <https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/nestjs>

- ### <a name="netcore"></a>NetCore

  We implemented two different _.NetCore_ services that use [island.is](https://island.is/) authentication service.

  1.  A service that uses [island.is](https://island.is/) authentication service as an oidc-provider with a registered audience, meaning that it´s only possible for tokens issued by [island.is](https://island.is/) authentication service with a specific scope to call the controllers or functions in the service marked with the _Authorization_ flag.
      It comes implemented with the _OpenApi_ specification using _Swagger_ and the _Swagger Authorization_ functionality so that you can generate tokens from [island.is](https://island.is/) authentication service using _Swagger_ and call the functions in the service without getting a 401 code.
      <https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/demo-apis/NetCoreDemoApi>

  2.  A service that is not protected by an oidc-provider but implements a call to a demo service that uses island.is authentication service as an oidc-provider.
      To do that the service needs to call the [island.is](https://island.is/) authentication service to get a _client_credentials_ token.
      The purpose of this service is to show the implementation of how to get a _client_credentials_ token from the [island.is](https://island.is/) authentication service using _NestJS_.
      It comes implemented with the _OpenApi_ specification using _Swagger_ but not the _Swagger Authorization_ functionality.
      <https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/netCore>

- ### <a name="angular"></a>Angular

  An angular client that demonstrates how you can generate and use the token from [island.is](https://island.is/) authentication service.
  It also demonstrates how you can then use that token to call a function in one of the demo services in _.NetCore_ or _NestJS_.
  <https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/angular>

- ### <a name="react"></a>React

  A react client that demonstrates how you can generate and use the token from [island.is](https://island.is/) authentication service.
  It also demonstrates how you can then use that token to call a function in one of the demo services in _.NetCore_ or _NestJS_.
  <https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/react>

- ### <a name="nextjs"></a>Next.js

  A _next.js_ client that demonstrates how you can generate and use the token from [island.is](https://island.is/) authentication service.
  It also demonstrates how you can use that token to call a function in one of the demo services in _.NetCore_ or _NestJS_.
  <https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/nextjs>

## <a name="info-links"></a>Info links

More information about how to connect with the authentication system in each developing environment can be found following these links:

- ### <a name="angular-link"></a>Angular:

  - <https://www.scottbrady91.com/Angular/SPA-Authentiction-using-OpenID-Connect-Angular-CLI-and-oidc-client>

- ### <a name="react-link"></a>React:

  - <https://medium.com/@franciscopa91/how-to-implement-oidc-authentication-with-react-context-api-and-react-router-205e13f2d49>

  - <https://github.com/skoruba/react-oidc-client-js>

- ### <a name="nestjs-link"></a>NestJS:

  - <https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authorization/>
