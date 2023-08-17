# Nest Sequelize Cursor Pagination

Based on this https://github.com/Kaltsoon/sequelize-cursor-pagination with inspiration from here https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32

## Example usage

### create a PaginatedExampleModelDto

```javascript
import { PageInfoDto } from '@island.is/nest/pagination'
import { ExampleModelList } from '../exampleModelList.model'

export class PaginatedExampleModelListDto {
  totalCount!: number
  data!: ExampleModelList[]
  pageInfo!: PageInfoDto
}
```

### in your module controller

```javascript
import { PaginationDto } from '@island.is/nest/pagination'

 async findMany(
    @Query() query: PaginationDto,
  ): Promise<PaginatedExampleModelDto> {
    return await this.moduleService.findMany(query)
  }
```

### in your module service

```javascript
import { paginate } from '@island.is/nest/pagination'

async findMany({ listId }: string, query: any) {
    // setup config and or defaults
    return await paginate({
      Model: this.ModelName,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'DESC']],
      where: { ListId: listId }, // insert sequelize where clause
    })
  }
```

### Example response body

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
    },
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

## Loop through dataset

next set of results

```javascript
http://localhost/path?after={pageInfo.endCursor}
```

previous set of results

```javascript
http://localhost/path?before={pageInfo.startCursor}
```

## Paginated GraphQL responses

This library contains a helper function to generate a typed paginated GraphQL response.

```javascript
import { ObjectType } from '@nestjs/graphql'

import { PaginatedResponse } from '@island.is/nest/pagination'

import { YourModel } from '../models/your.model'

@ObjectType('DomainPrefixPaginatedYourModelResponse')
export class PaginatedYourModelResponse extends PaginatedResponse(YourModel) {}
```
