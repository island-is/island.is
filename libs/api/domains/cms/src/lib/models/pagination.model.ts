import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pagination {
  @Field(type => Int)
  page: number

  @Field(type => Int)
  perPage: number

  @Field(type => Int)
  totalResults: number

  @Field(type => Int)
  totalPages: number
}
