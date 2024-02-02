import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('MinistryOfJusticePaging')
export class AdvertPaging {
  @Field(() => Number)
  page!: number

  @Field(() => Number)
  totalPages!: number

  @Field(() => Number)
  totalItems!: number

  @Field(() => Number)
  nextPage!: number

  @Field(() => Number, { nullable: true })
  previousPage?: number

  @Field(() => Number)
  pageSize!: number

  @Field(() => Boolean)
  hasNextPage!: boolean

  @Field(() => Boolean)
  hasPreviousPage!: boolean
}
