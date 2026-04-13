import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceUpdateTaxCardAllowanceInput')
export class UpdateTaxCardAllowanceInput {
  @Field(() => Int)
  percentage!: number
}
