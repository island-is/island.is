```markdown
# Nest Audit Module

This library provides a NestJS module to handle audit logging in backend services.

## Audit Entries

Audit all authenticated endpoints representing user actions, especially those handling sensitive user data and data that your organization owns. In the future, other government organizations will be trusted to audit delegated requests to data they own correctly.

An audit entry consists of the following fields:

- `user`: Information about the authenticated user, as provided by the [IdsAuth guard and @CurrentUser param decorator](../../auth-nest-tools).
- `namespace`: A namespace for the action, to prevent conflicts between different audit logs from different APIs. Formatted as `@domain.is/subNamespace`.
- `action`: The action performed by the user. Should be camelCase and start with a verb.
- `resources`: **Optional**: One or more resource IDs affected by the action.
- `meta`: **Optional**: An object containing extra information specific to the action.
- `alsoLog`: **Optional**: Logs the audit entry to the console. Useful for Datadog logs, for example.

## Setup

Import the audit module in your root module as follows:

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

The `groupName` and `serviceName` determine which CloudWatch Logs group and stream (respectively) the audit logs are stored in. When `NODE_ENV !== 'production'`, you can omit these options, in which case audit entries are logged with our [Logger module](../../logging) to the console.

The `defaultNamespace` option provides a default namespace for every audit entry logged but can be overridden if needed.

### Manual Audit

Inject the AuditService and CurrentUser as follows:

```typescript
import { AuditService } from '@island.is/nest/audit';

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

Create audit records as follows:

```typescript
// Uses the default namespace: '@island.is/apiName',
this.auditService.audit({
  auth: user,
  action: 'findAll',
});
```

Set a custom namespace, resources, and metadata as follows:

```typescript
const stuff = await this.stuffService.getStuff();
this.auditService.audit({
  auth: user,
  namespace: '@island.is/overridden',
  action: 'findAll',
  resources: stuff.map((s) => s.id),
  meta: { count: stuff.length },
  alsoLog: true,
});
```

For auditing an async action, wrap it like this:

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
);
```

### Controller/Resolver Audit

For simple controllers/resolvers, enable audit with decorators as follows:

```typescript
import { Audit } from '@island.is/nest/audit';

@Controller()
class MyController {
  @Get('stuff')
  @Audit()
  async findAll() {}
}
```

By default, the defaultNamespace will be used, and the handler name will be the action. Override audit entry fields at both the controller and the handler level:

```typescript
import { Audit } from '@island.is/nest/audit';

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
    return this.stuffService.getStuff();
  }
}
```

{% hint style="info" %}
To include request arguments as `meta`, use the `AuditService` methods.
{% endhint %}

## Running Unit Tests

Run `nx test nest-audit` to execute the unit tests via [Jest](https://jestjs.io).
```