# Email Service

## About

This library defines email-service, which allows its users to send email using nodemailer.

The service currently supports AWS SES and nodemailer's test account as transports, but can easily be extended to include other transports supported by nodemailer.

### NestJS Standalone - not recommended

Add the service to your Module providers:

```typescript
@Module({
  providers: [
    {
      provide: EMAIL_OPTIONS,
      useValue: environment.emailOptions,
    },
    EmailService,
  ],
})
```

## Code owners and maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
