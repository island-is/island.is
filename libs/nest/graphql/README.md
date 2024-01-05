# Nest GraphQL Utilities

This library exports the following utilities:

### `@CacheControl(options)`

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

Please read Apollo's documentation on [server-side caching](https://www.apollographql.com/docs/apollo-server/performance/caching/) to understand how caching works.

### `@CacheField(returnType, options)`

This decorator extends Nest's Field decorator to also configure the CacheControl directive. It defaults to `inheritMaxAge: true` if no cacheControl configuration is provided. This is super useful for non-scalar fields as these fields will otherwise break caching in parent resolvers.

The above example can thus be shortened to this:

```typescript
@ObjectType()
export class Article {
  @CacheField(() => Image)
  image: Image

  @CacheControl(() => ArticleAnalytics, { cacheControl: { maxAge: 3600 } })
  analytics: ArticleAnalytics
}
```

Please read Apollo's documentation on [server-side caching](https://www.apollographql.com/docs/apollo-server/performance/caching/) to understand how caching works.

## Running unit tests

Run `nx test nest-graphql` to execute the unit tests via [Jest](https://jestjs.io).
