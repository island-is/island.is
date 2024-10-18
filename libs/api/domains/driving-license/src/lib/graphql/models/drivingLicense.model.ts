import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Disqualification } from './disqualification.model'

import { Eligibility } from './eligibility.model'
import { Remark } from './remark.model'

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
  remarks?: Remark[]

  @Field(() => Disqualification, { nullable: true })
  disqualification?: Disqualification

  @Field({ nullable: true })
  birthCountry?: string
}
