import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Eligibility } from './eligibility.model'

@ObjectType()
export class DrivingLicense {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string

  @Field(() => Date)
  issued!: Date

  @Field(() => Date)
  expires!: Date

  @Field(() => [Eligibility])
  categories!: Eligibility[]

  @Field(() => [String])
  healthRemarks?: string[]
}
