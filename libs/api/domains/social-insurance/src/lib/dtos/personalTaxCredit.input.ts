import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceRegisterTaxCardAllowanceInput')
export class RegisterTaxCardAllowanceInput {
  @Field(() => Int)
  percentage!: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  month?: number
}

@InputType('SocialInsuranceUpdateTaxCardAllowanceInput')
export class UpdateTaxCardAllowanceInput {
  @Field(() => Int)
  percentage!: number
}

@InputType('SocialInsuranceDiscontinueTaxCardAllowanceInput')
export class DiscontinueTaxCardAllowanceInput {
  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  month?: number
}

@InputType('SocialInsuranceSetSpouseTaxCardDueToDeathInput')
export class SetSpouseTaxCardDueToDeathInput {
  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  percentage?: number
}
