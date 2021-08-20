import { Field, ObjectType } from '@nestjs/graphql'

import { ApplicationFilters } from '@island.is/financial-aid/shared'

@ObjectType()
export class ApplicationFiltersModel implements ApplicationFilters {
  @Field()
  readonly new!: number

  @Field()
  readonly inProgress!: number

  @Field()
  readonly dataNeeded!: number

  @Field()
  readonly rejected!: number

  @Field()
  readonly approved!: number
}
