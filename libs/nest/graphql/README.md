````markdown
# Nest GraphQL Utilities

This library exports the following utilities:

## `@CacheControl(options)`

This decorator can be used to set the cache control directive in your GraphQL resolvers.

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
````

You can also configure CacheControl on specific fields:

```typescript
@ObjectType()
export class Article {
  @Field(() => Image)
  @CacheControl({ inheritMaxAge: true })
  image: Image

  @Field(() => ArticleAnalytics)
  @CacheControl({ maxAge: 3600 })
  analytics: ArticleAnalytics
}
```

For more information, please refer to Apollo's documentation on [server-side caching](https://www.apollographql.com/docs/apollo-server/performance/caching/).

## `@CacheField(returnType, options)`

This decorator extends Nest's Field decorator to also configure the CacheControl directive. It defaults to `inheritMaxAge: true` if no cacheControl configuration is provided. This is particularly useful for non-scalar fields as these fields can otherwise disrupt caching in parent resolvers.

The example above can be abbreviated as follows:

```typescript
@ObjectType()
export class Article {
  @CacheField(() => Image)
  image: Image

  @CacheField(() => ArticleAnalytics, { cacheControl: { maxAge: 3600 } })
  analytics: ArticleAnalytics
}
```

## 🚀 How to Verify Caching Setup

**Check Cache-Control Headers**: When making a GraphQL query, inspect the HTTP response headers to ensure that the `Cache-Control` header is present. This header dictates how and for how long the response should be cached.

For more details, please see Apollo's documentation on [server-side caching](https://www.apollographql.com/docs/apollo-server/performance/caching/).

## Running Unit Tests

Run `nx test nest-graphql` to execute the unit tests via [Jest](https://jestjs.io).

```

```
