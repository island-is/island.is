import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum MileageFeeDifferenceOutcome {
  REFUNDED = 'refunded',
  ADDED_TO_NEXT_INVOICE = 'addedToNextInvoice',
  REVERSED = 'reversed',
}

registerEnumType(MileageFeeDifferenceOutcome, {
  name: 'VehiclesMileageFeeDifferenceOutcome',
})

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
