# NOVA SMS

## About

This library defines nova-sms, a service that is derived from Apollo's RESTDataSource.

The service allows its users to send sms messages on behalf of Island.is via Nova.

### NestJS GraphQLModule

Add the service to your GraphQLModule datasources:

To be done.

### NestJS Standalone - not recommended

Assuming `environment.smsOptions` implements `SmsServiceOptions`, add the module to your Module imports:

```typescript
@Module({
  imports: [
    SmsModule.register(environment.smsOptions),
  ],
})
```

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
