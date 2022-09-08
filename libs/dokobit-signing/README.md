# Dokobit Signing

## About

This library defines dokobit-signing, a service that is derived from Apollo's RESTDataSource.
The service allows its users to request individuals to sign PDF documents using their mobile electronic ids via Dokobit.

### Usage

Add `SigningModule` to your Module imports:

```typescript
@Module({
  imports: [SigningModule],
})
```

Add `signingModuleConfig` to your App Module imports:

```typescript
@Module(
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [signingModuleConfig],
    }),
  ]
)

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
```
