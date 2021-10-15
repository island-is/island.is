# Problem Types

This library has TypeScript enums and types for the [problems](https://datatracker.ietf.org/doc/html/rfc7807) that our APIs return.

## Handling problems with Apollo Client.

If you're using [`@island.is/nest/problem`](../../nest/problem/README.md) in your GraphQL API, the problem will be included as a GraphQL Error extension.

This library includes a utility to handle Problems on the client side:

```typescript
import { useMutation } from '@apollo/client'
import {
  ProblemType,
  findProblemInApolloError,
} from '@island.is/shared/problem'

// In some component:
const [callApi, { error }] = useMutation(MUTATION)
const problem = findProblemInApolloError(error) // undefined | Problem

if (problem && problem.type === ProblemType.SOMETHING) {
  // oh no
}
```

## Custom problem

Client code should use the `type` attribute as the primary identifier for problems. The other standard attributes are mainly helpful for developer experience and logs.

If you are ever tempted to create business logic around the title or details of a problem, or need extra metadata in problems, then consider to create a new custom problem.

First, add your new type to the [ProblemType enum](src/ProblemType.ts), with a docs.devland.is URL:

```typescript
export enum ProblemType {
  // [snip]
  NEW_PROBLEM = 'https://docs.devland.is/reference/problems/new-problem',
}
```

Then add an interface for your problem in [problems.ts](src/problems.ts).

```typescript
export interface NewProblem extends BaseProblem {
  type: ProblemType.NEW_PROBLEM
  extraAttribute: string
}
```

Add your problem interface to the [Problem](src/Problem.ts) union type.

Finally, add the new problem type to our [docs](../../../handbook/reference/problems/README.md). Make sure the documentation URL matches your problem type URL.

Check out the [`@island.is/nest/problem`](../../nest/problem/README.md#custom-problems) docs on how to return your new custom problem.

## Running unit tests

Run `nx test shared-problem` to execute the unit tests via [Jest](https://jestjs.io).
