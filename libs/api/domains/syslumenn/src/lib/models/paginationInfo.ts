import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PaginationInfo {
  @Field({ nullable: true })
  pageSize?: number

  @Field({ nullable: true })
  pageNumber?: number

  @Field({ nullable: true })
  totalCount?: number

  @Field({ nullable: true })
  totalPages?: number

  @Field({ nullable: true })
  currentPage?: number

  @Field({ nullable: true })
  hasNext?: boolean

  @Field({ nullable: true })
  hasPrevious?: boolean
}
