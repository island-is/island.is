import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('SocialInsuranceSetTaxCardAllowanceInput')
export class SetTaxCardAllowanceInput {
  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  percentage?: number
}

@InputType('SocialInsuranceEditTaxCardAllowanceInput')
export class EditTaxCardAllowanceInput {
  @Field(() => Int, { nullable: true })
  percentage?: number
}

@InputType('SocialInsuranceDiscontinueTaxCardAllowanceInput')
export class DiscontinueTaxCardAllowanceInput {
  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Int, { nullable: true })
  year?: number
}

@InputType('SocialInsuranceSetSpouseTaxCardInput')
export class SetSpouseTaxCardInput {
  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  percentage?: number
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
