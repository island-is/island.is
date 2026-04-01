import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceDiscontinueTaxCardAllowanceInput')
export class DiscontinueTaxCardAllowanceInput {
  @Field(() => Int, { nullable: true })
  year!: number

  @Field(() => Int, { nullable: true })
  month!: number
}
