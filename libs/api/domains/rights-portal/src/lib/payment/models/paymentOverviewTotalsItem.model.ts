import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewTotalsItem')
export class PaymentOverviewTotalsItem {
  @Field({ nullable: true })
  serviceTypeCode?: string

  @Field({ nullable: true })
  serviceTypeName?: string

  @Field(() => Int, { nullable: true })
  fullCost?: number

  @Field(() => Int, { nullable: true })
  copayCost?: number

  @Field(() => Int, { nullable: true })
  patientCost?: number
}
