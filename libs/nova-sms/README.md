```markdown
# NOVA SMS

## Overview

The `nova-sms` library is a service that is derived from Apollo's `RESTDataSource`. This service enables users to send SMS messages on behalf of Island.is using Nova.

## Integration with NestJS

### Using GraphQLModule

To integrate with the `GraphQLModule`, add `nova-sms` to your module's data sources (instructions to be provided).

### Standalone NestJS Usage (Not Recommended)

To use `nova-sms` as a standalone service in a NestJS application, follow these steps:

#### Step 1: Import `SmsModule`

Add `SmsModule` to the imports array of your module:

```typescript
import { Module } from '@nestjs/common';
import { SmsModule } from 'path-to-sms-module';

@Module({
  imports: [SmsModule],
})
export class YourModuleName {}
```

#### Step 2: Configure with `smsModuleConfig`

Include `smsModuleConfig` in your application's module imports for configuration:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import smsModuleConfig from 'path-to-sms-module-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [smsModuleConfig],
    }),
  ],
})
export class AppModule {}
```

## Code Owners and Maintainers

- [Kolibri](https://github.com/orgs/island-is/teams/kolibri/members)
```