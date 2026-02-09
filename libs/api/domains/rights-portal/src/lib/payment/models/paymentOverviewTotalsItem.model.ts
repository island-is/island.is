import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewTotalsItem')
export class PaymentOverviewTotalsItem {
  @Field({ nullable: true })
  serviceTypeCode!: string | null

  @Field(() => String, { nullable: true })
  serviceTypeName?: string | null

  @Field(() => Int, { nullable: true })
  fullCost!: number | null

  @Field(() => Int, { nullable: true })
  copayCost!: number | null

  @Field(() => Int, { nullable: true })
  patientCost!: number | null
}
