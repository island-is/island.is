import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceTaxCardSummary')
export class TaxCardSummary {
  @Field(() => Number, { nullable: true })
  percentage?: number

  @Field({ nullable: true })
  validFrom?: Date

  @Field(() => Date, { nullable: true })
  validTo?: Date | null

  @Field(() => String, { nullable: true })
  taxCardType?: string | null
}

@ObjectType('SocialInsuranceTaxCards')
export class TaxCards {
  @Field(() => [TaxCardSummary], { nullable: true })
  taxCards?: TaxCardSummary[] | null

  @Field(() => Boolean, { nullable: true })
  canEditPersonalAllowance?: boolean
}
