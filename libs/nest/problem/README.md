````markdown
# Nest Problem Module

This library includes a Nest Module that implements the [Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807) spec.

## Usage

Import `ProblemModule` in your root NestJS module.

```typescript
import { Module } from '@nestjs/common'
import { ProblemModule } from '@island.is/nest/problem'

@Module({
  imports: [ProblemModule],
})
export class AppModule {}
```
````

It will automatically filter all thrown errors and convert them to Problem Responses.

## GraphQL

For unhandled errors thrown in a GraphQL context, this module will enrich them with a `problem` extension.

If the error already has a `problem` attribute, then that will be used.

> **info**  
> Our [Enhanced Fetch](../../clients/middlewares/README.md) client automatically parses problem responses and includes a problem attribute in thrown errors. This means that problems from our REST services are automatically forwarded to the UI.

> **info**  
> For expected problems, consider following GraphQL best practices and model them [in the GraphQL schema](https://engineering.zalando.com/posts/2021/04/modeling-errors-in-graphql.html).

## Manual Problem Responses

The easiest way to manually return a problem response is to throw `ProblemError` or one of its subclasses:

```typescript
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'

throw new ProblemError({
  type: ProblemType.HTTP_NOT_FOUND,
  title: 'Not found',
})
```

The following subclasses are available for your convenience:

- `new ValidationFailed(fields)` - accepts a record of validation issues.

## Custom Problems

If none of the existing problem types suits your needs, consider [creating a new one](../../shared/problem/README.md#custom-problem).

When you've defined the problem type, you can return it like this:

```typescript
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'

throw new ProblemError({
  type: ProblemType.NEW_PROBLEM,
  title: 'Some new problem occurred',
  extraAttribute: 'example',
})
```

Optionally, you can create a `ProblemError` subclass like this:

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

// Later:
throw new NewProblem('extra')
```

## No Content Response

The API Design Guide describes how REST endpoints using resource IDs, i.e. `/delegation/:delegationId`, should use a `204 No Content` response instead of a `404 Not Found` response when no resource is found.

This module includes a `NoContentException` class that can be thrown to trigger a 204 No Content response:

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

> **warning**  
> Make sure you have included the `ProblemModule` in your root module. See [Usage](#usage).

## Running Unit Tests

Run `nx test nest-problem` to execute the unit tests via [Jest](https://jestjs.io).

```

```
