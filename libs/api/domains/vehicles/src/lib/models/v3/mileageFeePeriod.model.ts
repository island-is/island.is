import { Field, Int, ObjectType } from '@nestjs/graphql'

import { MileageFeeDifferenceOutcome } from './enums'

@ObjectType('VehiclesMileageFeePeriod')
export class MileageFeePeriod {
  @Field(() => Int)
  year!: number

  @Field(() => Int)
  month!: number

  @Field(() => Int)
  estimatedFee!: number

  @Field(() => Int, { nullable: true })
  confirmedFee?: number

  @Field(() => Int, { nullable: true })
  difference?: number

  @Field(() => MileageFeeDifferenceOutcome, { nullable: true })
  differenceOutcome?: MileageFeeDifferenceOutcome
}
