# auth-api-lib

This library contains services and models used by the IdentityServer (IdS) backend APIs, as well as the IdS administration APIs.

It contains a reusable module (AuthModule) with guards that can be used to protect other APIs and GraphQL resolvers.

## Using guards

### Configuration

Import and configure the AuthModule, example:

```typescript
@Module({
  imports: [
    AuthModule.register({
      audience: 'protected_resource',
      issuer: 'https://localhost:6001',
      jwksUri: 'http://localhost:6002/.well-known/openid-configuration/jwks',
    }),
```

where `audience` is the name your resource was registered under in IdS, `issuer` the IdS url, and `jwksUri` the IdS jwk endpoint (we probably won't need to configure this separately in the future).

### Using in API controller

Decorate the controller with `@UseGuards`:

```typescript
@UseGuards(IdsAuthGuard, ScopesGuard)
@Controller('clients')
export class ClientsController {
```

and individual protected methods with `@Scopes`:

```typescript
  @Scopes('protected_resource/read', 'protected_resource/admin')
  @Get(':id')
  @ApiOkResponse({ type: Client })
  async findOne(@Param('id') id: string): Promise<Client> {
```

If no `@Scopes` are applied to a method, then no access control is enforced for that method.

Information about the logged in user can be obtained by adding `@Req() request` as an input parameter to a controller method, and accessing `request.user`.

### Using in GraphQL resolver

Decorate the resolver with `@UseGuards`:

```typescript
@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class UserProfileResolver {
```

and individual protected methods with `@Scopes`:

```typescript
  @Scopes('protected_resource/read', 'protected_resource/admin')
  @Query(() => UserProfile, { nullable: true })
  getUserProfile(
```

If no `@Scopes` are applied to a method, then no access control is enforced for that method.

Information about the logged in user can be obtained by adding `@CurrentUser() user` as an input parameter to a resolver method.
