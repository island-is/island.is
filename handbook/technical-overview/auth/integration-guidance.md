# Tools and Examples

Authentication is a security critical part of applications, SPs SHOULD implement it with high-quality OIDC libraries rather than implementing OIDC from scratch.

## Tools

We recommend these libraries and frameworks to integrate OIDC:

**Authentication**

- [oidc-client-js](https://www.npmjs.com/package/oidc-client) - OIDC implementation for client-side JavaScript applications.
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js projects.
- [node-openid-client](https://github.com/panva/node-openid-client) - OIDC implementation for Node.js.
- [AppAuth](https://appauth.io/) - OIDC implementation for mobile apps: [iOS](https://github.com/openid/AppAuth-iOS), [Android](https://github.com/openid/AppAuth-Android), [JS](https://github.com/openid/AppAuth-JS), [React Native](https://formidable.com/open-source/react-native-app-auth/) and [Flutter](https://pub.dev/packages/flutter_appauth).
- [ASP.NET Core Authentication](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/secure-net-microservices-web-applications/#authenticate-with-an-openid-connect-or-oauth-20-identity-provider) - OIDC implementation for .NET.
- [Nimbus OAuth + OIDC SDK](https://connect2id.com/products/nimbus-oauth-openid-connect-sdk) - OIDC implementation for Java Applications.

**Validating access tokens**

- [Nimbus JOSE + JWT](https://connect2id.com/products/nimbus-jose-jwt) - JWT validation for Java.
- [passport-jwt](http://www.passportjs.org/packages/passport-jwt/) + [jwks-rsa](https://github.com/auth0/node-jwks-rsa) - JWT validation for Node.js.
- [ASP.NET Core Authentication](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/secure-net-microservices-web-applications/#consume-security-tokens) - JWT validation for .NET.

## Examples

We have a few sample integration projects showing how to connect to the authentication system in various languages and platforms.

{% hint style=info %}

For now, these examples are in a private repo and only available to our early integration partners.

{% endhint %}

### **NestJS:**

There are two different **NestJS** services which use IAS.

1. [A service](https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/demo-apis/NestDemoApi) with a "JWT" auth-guard that can be added as a guard to controllers or functions, meaning that it’s only possible for tokens issued by IAS with a specific scope to call those controllers or functions. It includes an OpenApi schema and Swagger configuration so that you can authenticate with IAS and call the service endpoints directly from Swagger.
2. [A service](https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/nestjs) which calls another service using IAS access tokens. The purpose of this example is to show how to use Client Credentials to get an Access Token from IAS in NestJS.

### **.NET**

We implemented two different .NET services which use IAS.

1. [A service](https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/demo-apis/NetCoreDemoApi) which authorises Access Tokens from IAS, meaning that it requires tokens issued by IAS with a specific scope to call the controllers or functions in the service marked with the `Authorization` flag. It includes an OpenApi schema and  Swagger configuration so that you can authenticate with IAS  and call the service endpoints directly from Swagger.
2. [A service](https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/netCore) which calls another service using  IAS access tokens. The purpose of this example is to show how to use Client Credentials  to get an Access Token from  IAS in NestJS.

### Next.js

A  next.js  [example](https://github.com/island-is/identity-server.samples/tree/feature/adding-sample-projects/nextjs) that demonstrates how you can generate and use the token from IAS. It also demonstrates how you can use that token to call a function in one of the demo services above.

## Postman

Check out [our article](postman-test.md) on how to configure Postman to authenticate with IAS.
