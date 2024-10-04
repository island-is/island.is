# Problem Library

## Problem Types

This library provides TypeScript enums and types for handling [RFC 7807 problems](https://datatracker.ietf.org/doc/html/rfc7807) returned by APIs.

### Handling Problems with Apollo Client

When using [`@island.is/nest/problem`](../../nest/problem/README.md) in your GraphQL API, problems are included as GraphQL Error extensions. The library provides a utility for client-side handling:

```typescript
import { useMutation } from '@apollo/client'
import {
  ProblemType,
  findProblemInApolloError,
} from '@island.is/shared/problem'

const [callApi, { error }] = useMutation(MUTATION)
const problem = findProblemInApolloError(error) // undefined | Problem

if (problem?.type === ProblemType.SOMETHING) {
  // handle problem
}
```

### Custom Problem

Use the `type` attribute to identify problems. For additional business logic or metadata, consider creating a custom problem.

1. Add a type to the [ProblemType enum](src/ProblemType.ts) with a `docs.devland.is` URL:

   ```typescript
   export enum ProblemType {
     NEW_PROBLEM = 'https://docs.devland.is/reference/problems/new-problem',
   }
   ```

2. Create an interface in [problems.ts](src/problems.ts):

   ```typescript
   export interface NewProblem extends BaseProblem {
     type: ProblemType.NEW_PROBLEM
     extraAttribute: string
   }
   ```

3. Update the [Problem](src/Problem.ts) union type.

4. Document in [docs](https://docs.devland.is/reference/problems) to match the problem type URL.

See [`@island.is/nest/problem`](../../nest/problem/README.md#custom-problems) docs for returning custom problems.

### Running Unit Tests

Use `nx test shared-problem` to run unit tests with [Jest](https://jestjs.io).

