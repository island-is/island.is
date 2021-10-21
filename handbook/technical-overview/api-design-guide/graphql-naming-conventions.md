# GraphQL Naming Conventions

This document describes the GraphQL's Naming Conventions

## Case styles

- **Field names** should use `camelCase`. Many GraphQL clients are written in JavaScript, Java, Kotlin, or Swift, all of which recommend camelCase for variable names.
- **Type names** should use `PascalCase`. This matches how classes are defined in the languages mentioned above.
- **Enum names** should use `PascalCase`.
- **Enum values** should use `ALL_CAPS`, because they are similar to constants.

### Examples

```graphql
type Dog {
  id: String!
}

query DogQuery {
  dog {
    id
  }
}

enum Animal {
  DOG
  CAT
}
```

## Input objects naming conventions

Use a single, required, unique, input object type as an argument for easier execution on the client.

```graphql
query DogQuery {
  dog(input: DogQueryInput!) {
    id
  }
}

mutation PetDogMutation {
  petDog(input: PetDogInput!) {
    id
  }
}
```

## Query naming conventions

GraphQL is about asking for specific fields on objects, therefore it's essential that the query has exactly the same shape as the result. Naming queries the same as the type will help with that:

```graphql
query {
  dog {
    id
  }
}
```

will result in:

```graphql
data {
  dog {
    id
  }
}
```

You can make a sub-selection of fields for that object. GraphQL queries can traverse related objects and their fields.

```graphql
query {
  dog {
    id
    owner {
      id
    }
  }
}
```

### Fetching array of items

GraphQL list queries work quite differently from single field queries. We know which one to expect based on what is indicated in the schema, which will be denoted by a `plural` name.

The pagination structure should follow a simplified version of the Relay's connection pattern.

```graphql
query {
  dog {
    id
    owners(first: 10, after: $endCursor) {
      count
      items {
        id
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

## Mutation naming conventions

Make mutations as specific as possible. Mutations should represent semantic actions that might be taken by the user whenever possible.

Name your mutations verb first. Then the object, or “noun,” if applicable; `createAnimal` is preferable to `animalCreate`.

```graphql
mutation {
  createAnimal(input: CreateAnimalInput!) {
    id
  }
}
```

## Integrating naming conventions into shared api

**Now for the hard part!**

Since all of our `resolvers` will be merged into a shared `api`, we need to come up with a system to avoid overwriting previous resolvers. Let's take this example to understand the problem better.

We have two projects, `ProjectX` and `ProjectY`. Both of these projects need to query a `user`, but the user type references a different resource.

1. `ProjectX`'s resolvers are merged first with the `user` query that fetches users from the `National Registry`.
2. `ProjectY`'s resolvers are merged after with the `user` query that fetches users from the `RSK`.

Here the `ProjectY`'s user query will overwrite the `ProjectX`'s query and will break `ProjectX`.

### Solution

We need to prefix all `Mutations`, `Queries`, `Types`, `Scalars`, etc. with the name of the module that is merged into the `api`.

Mutations should still follow the verb first rule. Then the module name, following the object, or “noun,” if applicable.

#### Example

```graphql
type ProjectXUser {
  id: String!
}

query {
  projectXUser {
    id
  }
}

mutation {
  createProjectXUser {
    id
  }
}
```

## Conclusion

With these design principles you should be equipped to design an effective GraphQL system for your API.
