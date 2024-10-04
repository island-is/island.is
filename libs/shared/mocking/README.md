# Mocking

This library provides helpers for setting up API mocking in Node.js and browser projects.

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
      const page = args.page || 0
      const perPage = args.perPage || 10
      return store.articles.slice(page * perPage, (page * perPage) + perPage)
    },
  },
})

if (process.env.NODE_ENV !== 'production' && process.env.API_MOCKS) {
  startMocking([createGraphqlHandler({ schema, resolvers })])
}
```

Generate the schema and types from the real API using [GraphQL Code Generator](https://graphql-code-generator.com/):

### schema.ts

```typescript
import { buildSchema } from 'graphql'

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
    articles(page: Number, perPage: Number): [Article]!
  }
`)
```

### types.ts

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
      input: { page?: number; perPage?: number }
    ) => Article[]
  }
}
```

## Functions

### `startMocking(requestHandlers)`

Initializes Mock Service Worker (MSW) with specified handlers.

Add `mockServiceWorker.js` to your public folder using `yarn msw init path/to/your/public/`. Automatically supported in Node.js.

#### Arguments

- `requestHandlers: Array<msw.RequestHandler>` - Array of mocked request handlers.

#### Returns

`msw.SetupWorkerApi | msw.SetupServerApi` - Utilities for managing handlers.

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
      return res(ctx.json({ username, firstName: 'John' }))
    }),
    createGraphqlHandler({ resolvers, schema }),
  ])
}
```

### `createGraphqlHandler(options: Options)`

Creates an MSW handler for GraphQL requests using a schema and resolvers.

#### Arguments

- `Options#mask?: string | RegExp` - URL patterns to handle. Default is `'*/api/graphql'`.
- `resolvers: Resolvers` - GraphQL resolvers defined via `createResolvers`.
- `schema: GraphQLSchema` - GraphQL schema for the mock API.

#### Returns

`msw.RequestHandler` - Add to `startMocking()`.

#### Example

Call real APIs with `context.fetch` in resolvers:

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

Creates a wrapper for mocked GraphQL resolvers.

#### Arguments

- `baseResolvers: Resolvers` - Initial mocked resolvers.

#### Returns

Methods for managing resolvers:

- `#add(resolvers: Resolvers)` - Adds or overrides mocked resolvers.
- `#reset()` - Resets resolvers to initial state.

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
})
```

### `createStore<Data>(initializer)`

Creates a store with mocked data for handlers, resolvers, and tests.

#### Arguments

- `initializer: () => Data` - Function to generate mock data.

#### Returns

Proxy object with store data and `$reset()` for restoring the initial state.

#### Usage

```typescript
import { createStore } from '@island.is/shared/mocking'
import { article } from './factories'

const store = createStore(() => ({
  articles: article.list(100),
}))

console.log(store.articles.length) // 100
store.articles = []
console.log(store.articles.length) // 0
store.$reset()
console.log(store.articles.length) // 100
```

### `factory<Type>(initializer)`

Creates an object factory for strongly typed objects.

#### Arguments

- `initializer` - Matches `Type` shape. Supports static or dynamic values.

Supports traits for customized object creation:

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

#### Returns

Factory object with methods for generating objects.

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

const primaryArticle = article('withAuthor', {
  title: 'Hello World',
})
```

### Other Helpers

- `title` - Returns a title string using `faker.lorem.words()`.

```typescript
import { factory, title } from '@island.is/shared/mocking'
factory({
  title: () => title(),
})
```

- `slugify(field)` - Creates slugged fields.

```typescript
import { factory, slugify } from '@island.is/shared/mocking'
factory({
  title: () => title(),
  slug: slugify('title'),
})
```

- `simpleFactory(initializerFn)` - Factory function with a `#list` helper.

```typescript
import { simpleFactory } from '@island.is/shared/mocking'
const slice = simpleFactory(() =>
  Math.random() > 0.5 ? contentSlice() : imageSlice(),
)
```

- `faker` - Re-export of [faker](https://github.com/marak/Faker.js) for creating mock data.

## Remove Mocking Code from Production Builds

Ensure `startMocking` executes only when `process.env.API_MOCKS === 'true'`.

To remove unused code, mark the `package.json` with:

```json
{
  "sideEffects": ["mocks/index.ts"]
}
```

