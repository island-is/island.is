# Dokobit Signing

## About

This library defines dokobit-signing, a service that is derived from Apollo's RESTDataSource.
The service allows its users to request individuals to sign PDF documents using their mobile electronic ids via Dokobit.

### NestJS GraphQLModule

Add the service to your GraphQLModule datasources:

To be done.

### NestJS Standalone - not recommended

Assuming `environment.signingOptions` implements `SigningServiceOptions`, add the module to your Module imports:

```typescript
@Module({
  imports: [
    SigningModule.register(environment.signingOptions),
  ],
})
```

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
