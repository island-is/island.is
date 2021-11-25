import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Eligibility } from './eligibility.model'

@ObjectType()
export class DrivingLicense {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string

  @Field()
  issued!: string

  @Field()
  expires!: string

  @Field(() => [Eligibility])
  categories!: Eligibility[]
}
