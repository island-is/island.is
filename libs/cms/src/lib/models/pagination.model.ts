import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Pagination {
  @Field(() => Int)
  page!: number

  @Field(() => Int)
  perPage!: number

  @Field(() => Int)
  totalResults!: number

  @Field(() => Int)
  totalPages!: number
}
