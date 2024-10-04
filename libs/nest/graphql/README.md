# Nest GraphQL Utilities

This library exports the following utilities:

## `@CacheControl(options)`

Decorator for setting cache control directives in GraphQL resolvers.

```typescript
@Resolver((type) => Article)
export class ArticleResolver {
  @Query(() => [Article])
  @CacheControl({ maxAge: 10 })
  articles() {}

  @ResolveField(() => User)
  @CacheControl({ inheritMaxAge: true })
  author() {}
}
```

Configure CacheControl on specific fields:

```typescript
@ObjectType()
export class Article {
  @Field(() => Image)
  @CacheControl({ inheritMaxAge: true })
  image: Image;

  @Field(() => ArticleAnalytics)
  @CacheControl({ maxAge: 3600 })
  analytics: ArticleAnalytics;
}
```

Refer to Apollo's [caching documentation](https://www.apollographql.com/docs/apollo-server/performance/caching/) for more information.

## `@CacheField(returnType, options)`

Extends Nest's Field decorator with CacheControl. Defaults to `inheritMaxAge: true`. Useful for non-scalar fields to maintain caching in parent resolvers.

Example:

```typescript
@ObjectType()
export class Article {
  @CacheField(() => Image)
  image: Image;

  @CacheControl(() => ArticleAnalytics, { cacheControl: { maxAge: 3600 } })
  analytics: ArticleAnalytics;
}
```

## 🚀 Verifying Caching Setup

**Check Cache-Control Headers**: Inspect HTTP response headers for `Cache-Control` after a GraphQL query to ensure correct caching.

Refer to Apollo's [caching documentation](https://www.apollographql.com/docs/apollo-server/performance/caching/) for more information.

## Running Unit Tests

Run `nx test nest-graphql` to execute unit tests using [Jest](https://jestjs.io).

