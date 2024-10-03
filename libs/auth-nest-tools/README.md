```markdown
# Auth Nest Tools

This library provides a reusable module (AuthModule) containing guards to secure REST controllers and GraphQL resolvers.

## Using Guards

There are several guards available:

- `IdsUserGuard`: Validates that the request includes a valid JWT bearer authorization from our identity server and checks for a `nationalId` claim, representing an authenticated user. JWT information can be accessed using the `CurrentAuth` and `CurrentUser` parameter decorators.
- `IdsAuthGuard`: Similar to `IdsUserGuard` but does not verify the `nationalId` claim. JWT information can be accessed using the `CurrentAuth` parameter decorator.
- `ScopesGuard`: Validates that the access token includes the required scopes. These can be configured using the `Scopes` decorator.

Generally, use `IdsUserGuard` for endpoints that return user resources for authenticated users and `IdsAuthGuard` for endpoints accessible to clients using client credentials. Always use `ScopesGuard` and the `@Scopes` decorator to protect endpoints; without it, the API will authorize all valid access tokens issued by IAS.

### Configuration

To import and configure the AuthModule, use the following example:

```typescript
@Module({
  imports: [
    AuthModule.register({
      issuer: 'https://localhost:6001'
    }),
```

Here, `issuer` is the IdS URL.

Some older APIs use `audience` for access control. Using `audience` is no longer recommended; instead, use scopes to guard individual methods as shown below. Only use `audience` after consulting the IDS team, and configure it as follows:

```typescript
@Module({
  imports: [
    AuthModule.register({
      issuer: 'https://localhost:6001',
      audience: '@island.is'
    }),
```

### Using with a REST Controller

Decorate the controller with `@UseGuards`:

```typescript
@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('clients')
export class ClientsController {
```

and protect individual methods with `@Scopes`:

```typescript
  @Scopes('protected_resource/read', 'protected_resource/admin')
  @Get(':id')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('id') id: string): Promise<Client> {
    // ...
  }
```

If a method is not decorated with `@Scopes`, then no access control is enforced.

You can obtain information about the logged-in user by adding `@CurrentUser() user: User` as an input parameter to the controller method.

### Using with a GraphQL Resolver

Decorate the resolver with `@UseGuards`:

```typescript
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class UserProfileResolver {
```

and protect individual methods with `@Scopes`:

```typescript
  @Scopes('userProfileScope')
  @Query(() => UserProfile, { nullable: true })
  async getUserProfile(@CurrentUser user: User) {
    // ... user.nationalId
  }
```

If a method is not decorated with `@Scopes`, then no access control is enforced.

Obtain information about the logged-in user by adding `@CurrentUser() user: User` as an input parameter to the resolver method.

### Opting Out of Auth

For public endpoints within a subsection of your controller or app, explicitly opt out of auth by decorating the resolver or controller with `@BypassAuth`:

```typescript
@BypassAuth()
@Controller('clients')
export class ClientsController {
```
```