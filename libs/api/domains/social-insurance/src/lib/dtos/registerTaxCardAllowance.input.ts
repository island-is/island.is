import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceRegisterTaxCardAllowanceInput')
export class RegisterTaxCardAllowanceInput {
  @Field(() => Int)
  percentage!: number

  @Field(() => Int)
  year!: number

  @Field(() => Int)
  month!: number
}
