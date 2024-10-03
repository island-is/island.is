````markdown
# Mocking

This library provides helpers to set up API mocking in Node.js and browser projects.

## Quick Start

```typescript
import {
  factory,
  createStore,
  createResolvers,
  createGraphqlHandler,
  startMocking,
  slugify,
  faker,
} from '@island.is/shared/mocking'
import schema from './schema'
import { Article, User, Resolvers } from './types'

const user = factory<User>({
  name: () => faker.name.findName(),
})

const article = factory<Article>({
  title: () => faker.lorem.words(),
  slug: slugify('title'),
  author: () => user(),
})

const store = createStore(() => ({
  articles: article.list(100),
}))

const resolvers = createResolvers<Resolvers>({
  Query: {
    articles: (_obj, args) => {
      const page = args.page ?? 0
      const perPage = args.perPage ?? 10
      const start = page * perPage
      return store.articles.slice(start, start + perPage)
    },
  },
})

if (process.env.NODE_ENV !== 'production' && process.env.API_MOCKS) {
  startMocking([createGraphqlHandler({ schema, resolvers })])
}
```
````

We recommend generating the schema and types from the real API using [GraphQL Code Generator](https://graphql-code-generator.com/). Use the following as a guide:

**schema.ts**

```typescript
import { buildSchema } from 'graphql'

// This should be pulled directly from the real API.
export default buildSchema(`
  type User {
    name: String!
  }

  type Article {
    title: String!
    slug: Slug!
    author: User!
  }

  type Query {
    articles(page: Int, perPage: Int): [Article]!
  }
`)
```

**types.ts**

```typescript
export interface User {
  name: string
}

export interface Article {
  title: string
  slug: string
  author: User
}

export interface Resolvers {
  User?: {
    name?: () => string
  }
  Article?: {
    title?: () => string
    slug?: () => string
    author?: () => User
  }
  Query?: {
    articles?: (
      obj: any,
      input: { page?: number; perPage?: number },
    ) => Article[]
  }
}
```

## Functions

### `startMocking(requestHandlers)`

Starts Mock Service Worker (MSW) with the specified MSW request handlers.

For this to work in browsers, you need to add `mockServiceWorker.js` to your public folder by running `yarn msw init path/to/your/public/`. It automatically works in Node.js.

{% hint style="info" %}
Note: Should only be called in development when mocking is enabled.
{% endhint %}

#### Arguments

- `requestHandlers: Array<msw.RequestHandler>` - A list of mocked request handlers. Can use standard MSW REST/GraphQL handlers. Strongly typed GraphQL mocks using `createGraphqlHandler` are recommended.

#### Returns

`msw.SetupWorkerApi | msw.SetupServerApi`

The return object can be used to add or override request handlers with `mocking.use(...requestHandlers)`. These can be reset with `mocking.resetHandlers()`.

#### Usage

```typescript
import { startMocking, createGraphqlHandler } from '@island.is/shared/mocking'
import { rest } from 'msw'
import resolvers from './resolvers'
import schema from './schema'

if (process.env.NODE_ENV !== 'production' && process.env.API_MOCKS) {
  startMocking([
    rest.post('/login', (req, res, ctx) => {
      const { username } = req.body
      return res(
        ctx.json({
          username,
          firstName: 'John',
        }),
      )
    }),
    createGraphqlHandler({ resolvers, schema }),
  ])
}
```

### `createGraphqlHandler(options: Options)`

Creates an MSW request handler which evaluates GraphQL requests using a schema and resolvers.

This handler is preferred over the built-in MSW GraphQL handlers as it can share the same schema as the real API and use strongly typed resolvers.

#### Arguments

- `Options#mask?: string | RegExp` - Which URLs to handle. Defaults to `'*/api/graphql'`.
- `resolvers: Resolvers` - GraphQL resolvers as returned by `createResolvers`.
- `schema: GraphQLSchema` - GraphQL schema for the mock API.

#### Returns

- `msw.RequestHandler` - Should be passed to `startMocking()`.

#### Calling Real APIs with `fetch`

MSW provides a special `fetch` function that ignores its mocking handlers. The GraphQL handler passes this `fetch` function to resolvers using the GraphQL context argument. Example:

```typescript
createGraphqlHandler({
  resolvers: createResolvers({
    Query: {
      hello: (_obj, _arg, context) => {
        context.fetch('...')
      },
    },
  }),
})
```

### `createResolvers(baseResolvers)`

Wraps an object with mocked GraphQL resolvers so it can be passed to `createGraphqlHandler`. Supports standard field and type resolvers.

The resolvers type should be generated with the [TypeScript Resolvers plugin](https://graphql-code-generator.com/docs/plugins/typescript-resolvers) in [GraphQL Code Generator](https://graphql-code-generator.com/) for strong typing.

#### Arguments

- `baseResolvers: Resolvers` - The initial mocked resolvers.

#### Returns

An object with the following methods:

- `#add(resolvers: Resolvers)` - Adds (and overrides) mocked resolvers. Useful for testing edge cases in E2E tests.
- `#reset()` - Resets resolvers to the initial resolvers passed to `createResolvers()`.

#### Usage

```typescript
import { createResolvers } from '@island.is/shared/mocking'
import { Resolvers } from './types'

const resolvers = createResolvers<Resolvers>({
  Query: {
    helloWorld: () => 'Hello World',
    me: () => ({ firstName: 'John', lastName: 'Doe' }),
  },
  Mutation: {
    setLanguage: () => {},
  },
  User: {
    fullName: (user) => `${user.firstName} ${user.lastName}`,
  },
  UnionType: {
    __resolveType: (obj) => obj.type,
  },
})
```

### `createStore<Data>(initializer)`

Creates a store containing mocked data which can be used by mock handlers, resolvers, and tests.

The store is created lazily, on demand, to avoid creating a lot of mock data until needed.

#### Arguments

- `initializer: () => Data` - A function that creates and returns the mock data as an object.

#### Returns

The object returned by the `initializer` function, with one additional property:

- `$reset(): void` - Resets the store to the initial state.

#### Usage

```typescript
import { createStore } from '@island.is/shared/mocking'
import { article } from './factories'

const store = createStore(() => ({
  articles: article.list(100),
  // ...
}))

console.log(store.articles.length) // 100
store.articles = []
console.log(store.articles.length) // 0
store.$reset()
console.log(store.articles.length) // 100
```

### `factory<Type>(initializer)`

Creates an object factory that can be used to create one or more objects using a strongly typed initializer and traits.

The `Type` generic can be specified explicitly based on types from the GraphQL schema for a better developer experience.

#### Arguments

- `initializer` - Initializer object matching the shape of `Type`.

Each property can have a static value or a function returning a dynamic value. Dynamic properties can depend on other properties and receive them as an argument or as `this`.

```typescript
factory({
  a: 5,
  b: (obj) => obj.a + 1,
})
```

- `initializer.$traits` - Map of traits usable during object creation. Each trait has a name and an object containing new values for created objects.

```typescript
factory({
  a: 5,
  $traits: {
    large: {
      a: 1000,
    },
  },
})
```

> Note: Properties are assigned in the order defined in the root `initializer` object. Example:
>
> ```typescript
> factory({
>   a: 5,
>   b() {
>     return this.a
>   },
>   c() {
>     return this.b
>   },
>
>   $traits: {
>     changed: {
>       c: 7,
>       // b will always return undefined since c is assigned after b.
>       b() {
>         return this.c
>       },
>     },
>   },
> })
> ```

#### Returns

A callable factory object.

`(...data: Array<string | object>) => Type`

Creates a new object according to the factory schema. Supports traits and overrides.

`#list(count: number, ...data: Array<string | object>) => Array<Type>`

Creates a list of `count` objects. Supports traits and overrides.

#### Usage

```typescript
import { factory, faker } from '@island.is/shared/mocking'
import { User, Article } from './types'

const user = factory<User>({
  name: () => faker.name.findName(),
})

const article = factory<Article>({
  title: () => faker.lorem.words(),
  body: () => faker.lorem.paragraphs(),
  author: null,

  $traits: {
    withAuthor: {
      author: () => user(),
    },
    long: {
      body: () => faker.lorem.paragraphs(20),
    },
  },
})

// Elsewhere:
const normalArticle = article()
const primaryArticle = article('withAuthor', {
  title: 'Hello World',
  body: 'Welcome to the site',
})
const articles = article.list(3, 'withAuthor') // [Article, Article, Article]
```

### Other Helpers

- `title()`

Returns a title-like string using `faker.lorem.words()`.

```typescript
import { factory, title } from '@island.is/shared/mocking'
factory({
  title: () => title(),
})
```

- `slugify(field)`

A helper to create slugged fields in factories:

```typescript
import { factory, title, slugify } from '@island.is/shared/mocking'
factory({
  title: () => title(),
  slug: slugify('title'),
})
```

- `simpleFactory(initializerFn)`

Wraps a normal factory function and provides a `#list` helper to run it multiple times. Suitable for factories creating values without a simple object schema (e.g., GraphQL union types).

```typescript
import { simpleFactory } from '@island.is/shared/mocking'
const slice = simpleFactory(() =>
  Math.random() > 0.5 ? contentSlice() : imageSlice(),
)
slice() // ContentSlice | ImageSlice
slice.list(3) // Array<ContentSlice | ImageSlice>
```

- `faker`

Re-exported [faker](https://github.com/Marak/faker.js) to create fake mock data. We may add our own locale in the future for more Icelandic mock data.

## Remove Mocking Code from Production Builds

Ensure `startMocking` is only called when `process.env.API_MOCKS === 'true'`. This enables Webpack to remove it from production bundles.

However, additional code remains such as resolver, handler, store, and factory code. Webpack avoids removing it due to potential side effects.

To optimize:

1. Within the mocking folder, create a `package.json` including `{ "sideEffects": false }`. This removes all code except `startMocking()`.
2. Isolate `startMocking` in its own file (e.g., `mocks/index.ts`) and specify it as the only file with side effects:

```json
{
  "sideEffects": ["mocks/index.ts"]
}
```

```

```
