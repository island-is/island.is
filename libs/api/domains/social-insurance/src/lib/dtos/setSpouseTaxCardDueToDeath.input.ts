import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceSetSpouseTaxCardDueToDeathInput')
export class SetSpouseTaxCardDueToDeathInput {
  @Field(() => Int)
  percentage!: number

  @Field(() => Int)
  year!: number

  @Field(() => Int)
  month!: number
}
