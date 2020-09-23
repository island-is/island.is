# Getting started

This library defines nova-sms, a service that is derived from Apollo's RESTDataSource.
The service allows its users to send sms messages on behalf of Island.is via Nova.

### NestJS GraphQLModule

Add the service to your GraphQLModule datasources:

To be done.

### NestJS Standalone - not recommended

Assuming `environment.smsOptions` implements `SmsServiceOptions`, add the service to your Module providers:

```typescript
@Module({
  providers: [
    {
      provide: 'SMS_OPTIONS',
      useValue: environment.smsOptions
    },
    {
      provide: SmsService,
      useFactory: (options: SmsServiceOptions, logger: Logger) => {
        const smsService = new SmsService(options, logger)
        smsService.initialize({} as DataSourceConfig<{}>)
        return smsService
      },
      inject: ['SMS_OPTIONS', LOGGER_PROVIDER],
    },
  ],
})
```
