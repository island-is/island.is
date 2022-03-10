# Mocking

This library provides helpers to set up API mocking in Node.JS and browser projects.

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

const store = createStore(() => {
  return {
    articles: article.list(100),
  }
})

const resolvers = createResolvers<Resolvers>({
  Query: {
    articles: (_obj, args) => {
      const page = args.page || 0
      const perPage = args.perPage || 10
      const start = page * perPage
      return store.articles.slice(start, start + perPage)
    },
  },
})

if (process.env.NODE_ENV !== 'production' && process.env.API_MOCKS) {
  startMocking([createGraphqlHandler({ schema, resolvers })])
}
```

We recommend generating the schema and types from the real api using [GraphQL Code Generator](https://graphql-code-generator.com/). Something like this:

**schema.ts**

```typescript
import { buildSchema } from 'graphql'

// This should be pulled directly from the real api.
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
    articles(page: Number, perPage: Number): Article[]!
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

Starts Mock Service Worker (MSW) with the specified MSW requestHandlers.

For this to work in browsers, you need to add `mockServiceWorker.js` to your public folder by running `yarn msw init path/to/your/public/`. Automatically works in Node.JS.

{% hint style="info" %}
Note: Should only be called in development when mocking is turned on.
{% endhint %}

#### Arguments

- `requestHandlers: Array<msw.RequestHandler>` - a list of mocked request handlers. Can use standard MSW rest/graphql handlers. We recommend using strongly typed GraphQL mocks using `createGraphqlHandler` below.

#### Returns

`msw.SetupWorkerApi | msw.SetupServerApi`

The return object can be used to add or override requestHandlers with `mocking.use(...requestHandlers)`. These can be reset with `mocking.resetHandlers()`.

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

Creates an MSW request handler which evaluates graphql requests using a schema and resolvers.

The reason we use this handler instead of the built in MSW graphql handlers is that it can share the same schema as the real API and use strongly typed resolvers.

This provides better developer experience when mocking resolvers and creating test data, and allows the CI to catch instances where mocks are out of date.

#### Arguments

- `Options#mask?: string | RegExp` - which urls to handle. Defaults to `'*/api/graphql'`.
- `resolvers: Resolvers` - graphql resolvers as returned by `createResolvers` below.
- `schema: GraphQLSchema` - graphql schema for mock api.

#### Returns

- `msw.RequestHandler` - should be passed to `startMocking()` above.

#### Calling real api's with `fetch`

MSW provides a special `fetch` function that ignores its mocking handlers. The graphql handler passes this `fetch` function to resolvers using the GraphQL context argument. Example:

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

Wraps a object with mocked graphql resolvers so it can be passed to `createGraphqlHandler`. Supports standard field and type resolvers.

The resolvers type should be generated with the [TypeScript Resolvers plugin](https://graphql-code-generator.com/docs/plugins/typescript-resolvers) in [GraphQL Code Generator](https://graphql-code-generator.com/) for everything to be strongly typed.

Depending on the schema and application, it's not necessary to fully implement all resolvers. Any field (including queries and mutations) which does not have a resolver, returns null.

#### Arguments

- `baseResolvers: Resolvers` - the initial mocked resolvers.

#### Returns

An object with the following methods:

- `#add(resolvers: Resolvers)` - adds (and overrides) mocked resolvers. Useful to test edge cases in E2E test.
- `#reset()` - resets resolvers to the initial resolvers passed to `createResolvers()`

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

Creates a store containing mocked data which can be used by mock handlers, resolvers and tests.

The store is created lazily, on demand, to not create a lot of mocking data until it's needed.

The store data can be freely edited (as plain JS objects), which is quite useful:

- Mutations and write handlers can edit the store for later queries.
- Tests can prepare special data for queries.

The store can also be reset to its initial state, e.g. in jest's `afterEach()`.

#### Arguments

- `initializer: () => Data` - a function which creates the mock data and returns as an object.

#### Returns

Short answer: The object returned by the `initalizer` function, with one additional property:

- `$reset(): void` - Resets the store to the initial state.

Long answer: A Proxy object. Most properties are forwarded to the object returned by the `initializer` function. The `initializer` function is lazily invoked the first time a property is accessed.

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

Creates an object factory which can be used to create one or more objects using a strongly typed initializer and traits.

The `Type` generic can be specified explicitly based on types from the GraphQL schema to give a better developer experience.

#### Arguments

- `initializer` - initializer object which matches the shape of `Type`.

Each property can have a static value (same for all created objects) or a function (dynamic value for each created object).

Dynamic properties can depend on other properties. The factory calls the property function with an object that contains all of the properties that have been assigned at that point. The object is passed both as `this` and as the first parameter.

```typescript
factory({
  a: 5,
  b: (obj) => obj.a + 1,
})
```

- `initializer.$traits` - map of traits which can be used when generating objects.

Traits can be specified at creation time to modify the created object. Each trait has a name (the key) and an object containing new values for the created object, either static or dynamic.

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

> Note: Properties are assigned in the order they are defined in the root `initializer` object (even if traits or overrides have another order). Example:
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

Create a new object according to the factory schema. The function accepts an optional list of traits to use and/or an object that overrides properties.

`#list(count: number, ...data: Array<string | object>) => Array<Type>`

Create a list of `count` objects. Supports traits and overrides.

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

### Other helpers

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

Wraps a normal factory function and provides a #list helper to run it multiple times. All arguments are passed directly through. Appropriate for factories which create values which don't have a simple object schema (e.g. GraphQL union types).

```typescript
import { simpleFactory } from '@island.is/shared/mocking'
const slice = simpleFactory(() =>
  Math.random() > 0.5 ? contentSlice() : imageSlice(),
)
slice() // ContentSlice | ImageSlice
slice.list(3) // Array<ContentSlice | ImageSlice>
```

- `faker`

Re-exported [faker](https://github.com/Marak/faker.js) to create fake mock data. One day we may add our own locale to create more Icelandic mock data.

## Remove mocking code from production builds

The first step is to only call `startMocking` when `process.env.API_MOCKS === 'true'`. Then Webpack is able to remove it from the bundle in production builds.

However, that still leaves all the resolver, handler, store and factory code. Webpack doesn't remove that because the code looks like this:

```typescript
const store = createStore(/* ... */)
```

Webpack knows that `store` is not used in production builds, but it won't remove the code since `createStore` could have some side-effect.

We can tell Webpack that there are no side effects in this code, by creating a `package.json` in the mocking folder that includes `{ sideEffects: false }`. However, that would remove the `startMocking()` call, which is a side effect we want (at least in development).

The fix is to keep `startMocking` in its own file (e.g. `mocks/index.ts`) and mark that as the only file with side effects:

```json
{
  "sideEffects": ["mocks/index.ts"]
}
```
