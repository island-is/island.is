import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'

export enum TaxCardAllowanceAction {
  REGISTER = 'register',
  EDIT = 'edit',
  DISCONTINUE = 'discontinue',
}

registerEnumType(TaxCardAllowanceAction, {
  name: 'SocialInsuranceTaxCardAllowanceAction',
})

@InputType('SocialInsuranceUpdateTaxCardAllowanceInput')
export class UpdateTaxCardAllowanceInput {
  @Field(() => TaxCardAllowanceAction)
  action!: TaxCardAllowanceAction

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  month?: number

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
