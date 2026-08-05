import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { TaxCardType } from '../../enums/taxCardType'

@ObjectType('SocialInsuranceTaxCardSummary')
export class TaxCardSummary {
  @Field(() => Int)
  percentage!: number

  @Field(() => GraphQLISODateTime)
  validFrom!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validTo?: Date

  @Field(() => TaxCardType)
  type!: TaxCardType
}
