import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Pagination } from './pagination.model';
import { News } from './news.model';

@ObjectType()
export class PaginatedNews {
  @Field(type => Pagination)
  page: Pagination

  @Field(type => [News])
  news: News[]
}
