```markdown
# Dokobit Signing

## About

This library provides `dokobit-signing`, a service that extends Apollo's `RESTDataSource`. The service allows its users to request individuals to sign PDF documents using their mobile electronic IDs via Dokobit.

## Usage

### Module Imports

To use this service, include `SigningModule` in your module imports:

```typescript
@Module({
  imports: [SigningModule],
})
export class YourModule {}
```

### Configuration

Add `signingModuleConfig` to your App Module imports for configuration:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [signingModuleConfig],
    }),
  ],
})
export class AppModule {}
```

## Code Owners and Maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
```