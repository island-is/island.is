import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql'
import { AnnualFee } from './annualFee'

@ObjectType('IntellectualPropertiesAnnualFeesInfo')
export class AnnualFeesInfo {
  @Field(() => GraphQLISODateTime, { nullable: true })
  nextPaymentDate?: Date

  @Field(() => [AnnualFee], { nullable: true })
  history?: Array<AnnualFee>
}
