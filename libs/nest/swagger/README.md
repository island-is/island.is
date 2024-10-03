````typescript
# Nest Swagger

The purpose of this library is to simplify REST documentation by combining the decorators of `nestjs/swagger` into a single decorator, called `@Documentation`.

## Awareness

This library modifies the response status of the route using the `@HttpCode(xxx)` decorator from `@nestjs/common`.

## Usage

```typescript
import { Documentation } from '@island.is/nest/swagger'

@Documentation({
  description: 'This endpoint fetches a single animal',
  includeNoContentResponse: true,
  response: { status: 200, type: AnimalDTO },
  request: {
    query: {
      search: {
        required: true,
        schema: {
          enum: [SearchEnum],
          default: SearchEnum.query,
        },
      },
    },
    params: {
      animalId: {
        type: 'string',
        description: 'ID of the animal',
      },
    }
  },
})
````

This usage would add the following decorators (subject to change with code additions):

1. `@HttpCode(200)`
2. `@ApiInternalServerErrorResponse({ type: HttpProblemResponse })`
3. `@ApiBadRequestResponse({ type: HttpProblemResponse })`
4. `@ApiOkResponse({ status: 200, type: AnimalDTO })`
5. `@ApiNoContentResponse()`
6. `@ApiQuery({ name: 'search', required: true, schema: { enum: [SearchEnum], default: SearchEnum.query } })`
7. `@ApiParam({ name: 'animalId', type: 'string', description: 'ID of the animal' })`
8. `@ApiNotFoundResponse({ type: HttpProblemResponse })`
9. `@ApiUnauthorizedResponse({ type: HttpProblemResponse })`
10. `@ApiForbiddenResponse({ type: HttpProblemResponse })`
11. `@ApiOperation({ description: 'This endpoint fetches a single animal' })`

### Detailed Explanation of Decorators

The following is the interpretation of the object's structure that is passed to the `@Documentation` decorator:

- **description**:

  - Yields `@ApiOperation`

- **response**:

  - Yields `@HttpCode`
  - Yields `@ApiOkResponse` if **response.status** == 200
  - Yields `@ApiCreatedResponse` if **response.status** == 201
  - Yields `@ApiConflictResponse` if **response.status** == 409
  - Yields `@ApiNoContentResponse` if **response.status** == 204

- **request.query**:

  - Yields `@ApiQuery`

- **request.params**:

  - Yields `@ApiParam`
  - Yields `@ApiNotFoundResponse`

- **includeNoContentResponse**:
  - Defaults to _false_ for backward compatibility. When set to _true_, it yields `@ApiNoContentResponse` as an additional response status on methods using path parameters, to use 204 instead of 404.

`@ApiInternalServerErrorResponse` and `@ApiBadRequestResponse` are always provided as default decorators.

`@ApiForbiddenResponse` and `@ApiUnauthorizedResponse` are provided based on the **isAuthorized** option, which defaults to _true_.

## Running Unit Tests

Run `yarn test nest-swagger`

```

```
