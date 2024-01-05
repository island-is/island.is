# Nest Audit Module

This library provides a NestJS module to handle audit logging in our backend services.

## Audit entries

We should audit all authenticated endpoints representing user actions. We should also audit authenticated endpoints handling sensitive user data, and data that we own. In the future, we'll trust other government organisations to correctly audit delegated requests to data they own.

There are a few different ways to log an action depending on what you're doing, but in the end an audit entry consists of these fields:

- `user` - Information about the authenticated user, as provided by the [IdsAuth guard and @CurrentUser param decorator](../../auth-nest-tools).
- `namespace` - A namespace for the action, to prevent conflicts between different audit logs from different APIs. Formatted like this: `@domain.is/subNamespace`
- `action` - The action performed by the user. Should be camelCase and start with a verb.
- `resources` - **Optional**: One or more resource ids affected by the action.
- `meta` - **Optional**: An object of extra information specific to the action.
- `alsoLog` - **Optional**: Logs the audit entry to the console. Useful for Datadog logs for example.

## Setup

Import the audit module in your root module like this:

```typescript
@Module({
  imports: [
    AuditModule.forRoot({
      groupName: 'CloudWatch Logs Group Name',
      serviceName: 'api-name',
      defaultNamespace: '@island.is/apiName',
    }),
  ],
})
export class AppModule {}
```

The `groupName` and `serviceName` affect which Cloudwatch Logs group and stream (respectively) the audit logs are stored in. When `NODE_ENV !== 'production'`, you can skip these options in which case audit entries are logged with our [Logger module](../../logging) to the console.

The optional `defaultNamespace` option provides a default namespace for every audit entry logged. It can still be overridden as needed.

### Manual audit

Make sure to inject the AuditService and CurrentUser:

```typescript
import { AuditService } from '@island.is/nest/audit'

@Controller()
class MyController {
  constructor(private auditService: AuditService) {}

  @Get('stuff')
  async findAll(
    @CurrentUser()
    user: User,
  ) {
    // ...
  }
}
```

Then you can create audit records like this:

```typescript
// uses the default namespace: '@island.is/apiName',
this.auditService.audit({
  auth: user,
  action: 'findAll',
})
```

You can set custom namespace, resources and metadata like this:

```typescript
const stuff = await this.stuffService.getStuff()
this.auditService.audit({
  auth: user,
  namespace: '@island.is/overridden',
  action: 'findAll',
  resources: stuff.map((s) => s.id),
  meta: { count: stuff.length },
  alsoLog: true,
})
```

If you are auditing an async action, you can wrap it like this:

```typescript
return this.auditService.auditPromise(
  {
    auth: user,
    action: 'findAll',
    alsoLog: true,
    resources: (stuff) => stuff.map((s) => s.id),
    meta: (stuff) => ({ count: stuff.length }),
  },
  this.stuffService.getStuff(),
)
```

### Controller/Resolver audit

For simple controllers/resolvers, you can enable audit with decorators like this:

```typescript
import { Audit } from '@island.is/nest/audit'

@Controller()
class MyController {
  @Get('stuff')
  @Audit()
  async findAll() {}
}
```

By default, it will use the defaultNamespace, and the handler name as the action. You can override all the audit entry fields at both the controller level and the handler level:

```typescript
import { Audit } from '@island.is/nest/audit'

@Controller()
@Audit({ namespace: '@island.is/overridden' })
class MyController {
  constructor(private stuffService: StuffService) {}

  @Get('stuff')
  @Audit<Stuff[]>({
    action: 'findStuff',
    resources: (stuff) => stuff.map((s) => s.id),
    meta: (stuff) => ({ count: stuff.length }),
  })
  async findAll() {
    return this.stuffService.getStuff()
  }
}
```

{% hint style="info" %}
If you want to include request arguments as `meta`, you should use the `AuditService` methods instead.
{% endhint %}

## Running unit tests

Run `nx test nest-audit` to execute the unit tests via [Jest](https://jestjs.io).
