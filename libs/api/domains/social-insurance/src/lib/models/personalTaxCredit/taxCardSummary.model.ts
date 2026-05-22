import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { TaxCardType } from '../../enums/taxCardType'

@ObjectType('SocialInsuranceTaxCardSummary')
export class TaxCardSummary {
  @Field(() => Int, { nullable: true })
  percentage?: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  validFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validTo?: Date

  @Field(() => TaxCardType, { nullable: true })
  type?: TaxCardType
}
