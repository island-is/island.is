import { Field, ObjectType } from '@nestjs/graphql'

import { ApplicationFilters } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class ApplicationFiltersModel implements ApplicationFilters {
  @Field()
  readonly New!: number

  @Field()
  readonly InProgress!: number

  @Field()
  readonly DataNeeded!: number

  @Field()
  readonly Rejected!: number

  @Field()
  readonly Approved!: number

  @Field()
  readonly MyCases!: number
}
