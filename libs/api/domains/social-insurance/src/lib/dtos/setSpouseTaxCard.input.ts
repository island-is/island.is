import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceSetSpouseTaxCardInput')
export class SetSpouseTaxCardInput {
  @Field(() => Int)
  percentage!: number

  @Field(() => Int)
  year!: number

  @Field(() => Int)
  month!: number
}
