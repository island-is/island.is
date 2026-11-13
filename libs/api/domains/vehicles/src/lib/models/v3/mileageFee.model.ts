import { Field, Int, ObjectType } from '@nestjs/graphql'

import { MileageFeePeriod } from './mileageFeePeriod.model'

@ObjectType('VehiclesMileageFee')
export class MileageFee {
  @Field(() => [Int])
  years!: number[]

  @Field(() => [MileageFeePeriod])
  periods!: MileageFeePeriod[]

  @Field(() => Int)
  estimatedFeeTotal!: number

  @Field(() => Int)
  confirmedFeeTotal!: number

  @Field(() => Int)
  reversalThreshold!: number

  @Field()
  downloadServiceUrl!: string
}
