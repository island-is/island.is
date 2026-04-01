import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceRegisterTaxCardAllowanceInput')
export class RegisterTaxCardAllowanceInput {
  @Field(() => Int)
  percentage!: number

  @Field(() => Int, { nullable: true })
  year!: number

  @Field(() => Int, { nullable: true })
  month!: number
}
