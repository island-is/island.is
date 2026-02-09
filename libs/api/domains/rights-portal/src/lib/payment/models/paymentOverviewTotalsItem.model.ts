import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewTotalsItem')
export class PaymentOverviewTotalsItem {
  @Field(() => String, { nullable: true })
  serviceTypeCode!: string | null

  @Field(() => String, { nullable: true })
  serviceTypeName?: string | null

  @Field(() => Number, { nullable: true })
  fullCost!: number | null

  @Field(() => Number, { nullable: true })
  copayCost!: number | null

  @Field(() => Number, { nullable: true })
  patientCost!: number | null
}
