````javascript
# Nest Sequelize Cursor Pagination

Based on this <https://github.com/Kaltsoon/sequelize-cursor-pagination> with inspiration from here <https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32>

## Example Usage

### Create a PaginatedExampleModelDto

```javascript
import { PageInfoDto } from '@island.is/nest/pagination'
import { ExampleModelList } from '../exampleModelList.model'

// DTO for the paginated response
export class PaginatedExampleModelListDto {
  totalCount!: number;
  data!: ExampleModelList[];
  pageInfo!: PageInfoDto;
}
````

### In Your Module Controller

```javascript
import { PaginationDto } from '@island.is/nest/pagination'

// Method to handle pagination queries
async findMany(
  @Query() query: PaginationDto,
): Promise<PaginatedExampleModelDto> {
  return await this.moduleService.findMany(query);
}
```

### In Your Module Service

```javascript
import { paginate } from '@island.is/nest/pagination'

// Service method to setup pagination configuration and defaults
async findMany({ listId }: string, query: any) {
  return await paginate({
    Model: this.ModelName,
    limit: query.limit || 10,
    after: query.after,
    before: query.before,
    primaryKeyField: 'counter',
    orderOption: [['counter', 'DESC']],
    where: { ListId: listId }, // Insert sequelize where clause
  });
}
```

### Example Response Body

```javascript
{
  "totalCount": 100,
  "data": [
    {
      "id": "480784bc-b25d-4a60-8e94-d17036e0fd83",
      "title": "rerum magni",
      "description": "Omnis velit earum voluptatum.",
      "created": "2021-10-06T14:43:19.243Z",
      "modified": "2021-10-06T14:43:19.243Z"
    },
    {
      "id": "480784bc-b25d-4a60-8e94-d17036e0fd83",
      "title": "rerum magni",
      "description": "Omnis velit earum voluptatum.",
      "created": "2021-10-06T14:43:19.243Z",
      "modified": "2021-10-06T14:43:19.243Z"
    }
  ],
  "pageInfo": {
    "hasNextPage": true,
    "hasPreviousPage": false,
    "startCursor": "WzNd",
    "endCursor": "WzM2XQ=="
  }
}
```

## Loop Through Dataset

Fetch the next set of results:

```javascript
http://localhost/path?after={pageInfo.endCursor}
```

Fetch the previous set of results:

```javascript
http://localhost/path?before={pageInfo.startCursor}
```

## Paginated GraphQL Responses

This library contains a helper function to generate a typed paginated GraphQL response.

```javascript
import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { YourModel } from '../models/your.model'

// Generates a GraphQL object type for a paginated response
@ObjectType('DomainPrefixPaginatedYourModelResponse')
export class PaginatedYourModelResponse extends PaginatedResponse(YourModel) {}
```
