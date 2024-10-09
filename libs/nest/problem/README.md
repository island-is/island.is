# Nest Problem Module

This library implements the [Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807) spec in a NestJS module.

## Usage

Import `ProblemModule` in your root NestJS module:

```typescript
import { Module } from '@nestjs/common'
import { ProblemModule } from '@island.is/nest/problem'

@Module({
  imports: [ProblemModule],
})
export class AppModule {}
```

It filters all thrown errors and converts them to Problem Responses.

## GraphQL

For unhandled errors in GraphQL, the module enriches them with a "problem" extension. If the error already has a `problem` attribute, it will be used.

Note: Our [Enhanced Fetch](../../clients/middlewares/README.md) client parses problem responses and includes a problem attribute in errors, forwarding issues from REST services to the UI.

Consider modeling expected problems [in the GraphQL schema](https://engineering.zalando.com/posts/2021/04/modeling-errors-in-graphql.html).

## Manual problem responses

To manually return a problem response, throw `ProblemError` or its subclasses:

```typescript
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'

throw new ProblemError({
  type: ProblemType.HTTP_NOT_FOUND,
  title: 'Not found',
})
```

Available subclasses include:

- `ValidationFailed(fields)`: Accepts validation issues.

## Custom problems

To create a new problem type, [define one](../../shared/problem/README.md#custom-problem) and use it as follows:

```typescript
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'

throw new ProblemError({
  type: ProblemType.NEW_PROBLEM,
  title: 'Some new problem occurred',
  extraAttribute: 'example',
})
```

Or create a custom subclass:

```typescript
import { ProblemType } from '@island.is/shared/problem'
import { ProblemError } from './ProblemError'

export class NewProblem extends ProblemError {
  constructor(extraAttribute: string) {
    super({
      type: ProblemType.NEW_PROBLEM,
      title: 'Some new problem',
      status: 400,
      extraAttribute,
    })
  }
}

// Later use:
throw new NewProblem('extra')
```

## No Content response

Use the `NoContentException` class to trigger a 204 No Content response:

```typescript
export class DelegationService {
  async findOne(delegationId: string) {
    const delegation = await this.delegationModel.findOne({
      where: {
        id: delegationId,
      },
    })

    if (!delegation) {
      throw new NoContentException()
    }

    return delegation
  }
}
```

Ensure the `ProblemModule` is included in your root module. See [usage](#usage).

## Running unit tests

Run `nx test nest-problem` to execute tests via [Jest](https://jestjs.io).
