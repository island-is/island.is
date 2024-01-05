# Nest Swagger

The purpose of this library is to make REST documentation easier by combining
the decorators of `nestjs/swagger` into a single decorator, called
`@Documentation`.

## Awareness

This library changes the response status of the route by using the:

```typescript
@HttpCode(xxx)
```

decorator from `@nestjs/common`

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
```

This usage would add the following decorators (subject to change with code additions):

1. @HttpCode(200)
2. @ApiInternalServerErrorResponse({ type: HttpProblemResponse })
3. @ApiBadRequestResponse({ type: HttpProblemResponse })
4. @ApiOkResponse({ status: 200, type: AnimalDTO })
5. @ApiNoContentResponse()
6. @ApiQuery({ name: 'search', required: true, schema: { enum: [SearchEnum], default: SearchEnum.query, } })
7. @ApiParam({ name: 'animalId', type: 'string', description: 'ID of the animal' })
8. @ApiNotFound({ type: HttpProblemResponse })
9. @ApiUnauthorizedResponse({ type: HttpProblemResponse }),
10. @ApiForbiddenResponse({ type: HttpProblemResponse }),
11. @ApiOperation({description: 'This endpoint fetches a single animal'})

### Detailed explanation of yielded decorators

The following is the interpretation of the object's structure that is passed to the `@Documentation` decorator:

- **description** yields:
  - `@ApiOperation`
- **response** yields:
  - `@HttpCode`
  - `@ApiOkResponse` if **response.status** == 200
  - `@ApiCreatedResponse` if **response.status** == 201
  - `@ApiConflictResponse` if **response.status** == 201
  - `@ApiNoContentReponse` if **response.status** == 204
- **request.query** yields:
  - `@ApiQuery`
- **request.params** yields:
  - `@ApiParam`
  - `@ApiNotFound`
- **includeNoContentResponse** defaults to _false_ for backwards compatibility. When set to _true_ it yields:
  - `@ApiNoContentResponse` as additional response status on methods using path param, to use 204 instead of 404.

`@ApiInternalServerErrorReponse` and `@ApiBadRequest` are always provided, as default decorators

`@ApiForbiddenResponse` and `@ApiUnauthorizedResponse` will be provided based on the **isAuthorized** option, defaults to _true_.

## Running unit tests

Run `yarn test nest-swagger`
