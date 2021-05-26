import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Eligibility } from './eligibility.model'

@ObjectType()
export class DrivingLicense {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  issued!: string

  @Field()
  expires!: string

  @Field({ nullable: true })
  isProvisional!: boolean | null

  @Field(() => [Eligibility])
  eligibilities!: Eligibility[]
}
