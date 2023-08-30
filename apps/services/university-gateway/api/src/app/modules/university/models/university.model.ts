import { Field, ObjectType, ID } from '@nestjs/graphql'

import type { University as TUniversity } from '@island.is/university-gateway-types'

@ObjectType()
export class University implements TUniversity {
  @Field(() => ID)
  readonly id!: string

  @Field()
  nationalId!: string

  @Field()
  contentfulKey!: string

  @Field()
  created!: Date

  @Field()
  modified!: Date
}
