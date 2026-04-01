import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceDiscontinueTaxCardAllowanceInput')
export class DiscontinueTaxCardAllowanceInput {
  @Field(() => Int)
  year!: number

  @Field(() => Int)
  month!: number
}
