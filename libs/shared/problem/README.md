```typescript
# Problem Types

This library provides TypeScript enums and types for the [problems](https://datatracker.ietf.org/doc/html/rfc7807) returned by our APIs.

## Handling Problems with Apollo Client

If you're utilizing [`@island.is/nest/problem`](../../nest/problem/README.md) in your GraphQL API, the problem detail will be included as a GraphQL Error extension.

This library offers a utility to handle problems on the client side:

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
  // Custom handling logic here
}
```

## Creating a Custom Problem

Client code should use the `type` attribute as the primary identifier for any problems. The other standard attributes are mainly beneficial for developer experience and logging purposes.

If you find the need to create business logic based on the title or details of a problem, or require additional metadata in problems, consider creating a new custom problem.

To add a new type, extend the [ProblemType enum](src/ProblemType.ts) with an appropriate `docs.devland.is` URL:

```typescript
export enum ProblemType {
  // [snip]
  NEW_PROBLEM = 'https://docs.devland.is/reference/problems/new-problem',
}
```

Next, define an interface for your problem in [problems.ts](src/problems.ts):

```typescript
export interface NewProblem extends BaseProblem {
  type: ProblemType.NEW_PROBLEM
  extraAttribute: string
}
```

Incorporate your problem interface into the [Problem](src/Problem.ts) union type.

Finally, update our [documentation](../../../handbook/reference/problems/README.md) to include your new problem type. Ensure that the documentation URL matches your problem type URL.

For more details on returning your custom problem, refer to the [`@island.is/nest/problem`](../../nest/problem/README.md#custom-problems) documentation.

## Running Unit Tests

Execute `nx test shared-problem` to run the unit tests using [Jest](https://jestjs.io).
```