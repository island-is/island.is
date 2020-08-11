import { Field, ObjectType } from '@nestjs/graphql'
import { Pagination } from './pagination.model'
import { News } from './news.model'

@ObjectType()
export class PaginatedNews {
  @Field(() => Pagination)
  page: Pagination

  @Field(() => [News])
  news: News[]
}
