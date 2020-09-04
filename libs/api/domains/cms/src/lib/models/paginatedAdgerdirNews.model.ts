import { Field, ObjectType } from '@nestjs/graphql'
import { Pagination } from './pagination.model'
import { AdgerdirNews } from './adgerdirNews.model'

@ObjectType()
export class PaginatedAdgerdirNews {
  @Field(() => Pagination)
  page: Pagination

  @Field(() => [AdgerdirNews])
  news: AdgerdirNews[]
}
