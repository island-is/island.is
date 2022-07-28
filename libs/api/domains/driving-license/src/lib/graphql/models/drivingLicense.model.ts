import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Disqualification } from './disqualification.model'

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

  @Field(() => [String])
  healthRemarks?: string[]

  @Field(() => Disqualification, { nullable: true })
  disqualification?: Disqualification
}
