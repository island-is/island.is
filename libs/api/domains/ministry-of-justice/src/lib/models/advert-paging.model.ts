import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('MinistryOfJusticePaging')
export class AdvertPaging {
  @Field(() => Number)
  page!: number

  @Field(() => Number)
  totalPages!: number

  @Field(() => Number)
  totalItems!: number

  @Field(() => Number, { nullable: true })
  nextPage!: number | null

  @Field(() => Number, { nullable: true })
  previousPage!: number | null

  @Field(() => Number)
  pageSize!: number

  @Field(() => Boolean, { nullable: true })
  hasNextPage!: boolean | null

  @Field(() => Boolean, { nullable: true })
  hasPreviousPage!: boolean | null
}
