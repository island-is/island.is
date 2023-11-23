# Auth Nest Tools

This library contains a reusable module (AuthModule) with guards that can be used to protect other REST controllers and GraphQL resolvers.

## Using guards

There are a couple of guards available.

- `IdsUserGuard`: validates that the request has a valid JWT bearer authorization from our identity server and checks that it has a nationalId claim, representing an authenticated user. Information from the JWT can be accessed using the CurrentAuth and CurrentUser parameter decorators.
- `IdsAuthGuard`: same as `IdsUserGuard` but does not verify the `nationalId` claim. Information from the JWT can be accessed using the CurrentAuth parameter decorator.
- `ScopesGuard`: checks if the access token has required scopes. These can be configured using the Scopes decorator.

You should generally add `IdsUserGuard` and `ScopesGuard` to endpoints that return user resources for the authenticated user. You can use `IdsAuthGuard` for endpoints that need to be available for clients authenticating with client credentials.

### Configuration

Import and configure the AuthModule, example:

```typescript
@Module({
  imports: [
    AuthModule.register({
      issuer: 'https://localhost:6001'
    }),
```

where `issuer` is the IdS url.

### Using in REST controller

Decorate the controller with `@UseGuards`:

```typescript
@UseGuards(IdsUserGuard, ScopesGuard)
@Controller('clients')
export class ClientsController {
```

and individual protected methods with `@Scopes`:

```typescript
  @Scopes('protected_resource/read', 'protected_resource/admin')
  @Get(':id')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('id') id: string): Promise<Client> {
    // ...
  }
```

If no `@Scopes` are applied to a method, then no access control is enforced for that method.

Information about the logged in user can be obtained by adding `@CurrentUser() user: User` as an input parameter to the controller method.

### Using in GraphQL resolver

Decorate the resolver with `@UseGuards`:

```typescript
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class UserProfileResolver {
```

and individual protected methods with `@Scopes`:

```typescript
  @Scopes('userProfileScope')
  @Query(() => UserProfile, { nullable: true })
  async getUserProfile(@CurrentUser user: User) {
    // ... user.nationalId
  }
```

If no `@Scopes` are applied to a method, then no access control is enforced for that method.

Information about the logged in user can be obtained by adding `@CurrentUser() user: User` as an input parameter to the resolver method.

### Opting out of auth

If a small subsection of your controller or app has public endpoints you can explicitly opt out of auth for those sections.

Decorate the resolver or controller with `@BypassAuth`:

```typescript
@BypassAuth()
@Controller('clients')
export class ClientsController {
```
