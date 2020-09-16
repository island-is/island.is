# Getting started

This library defines a service that is derived from Apollo's RESTDataSource.

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
