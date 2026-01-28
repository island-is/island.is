import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewTotalsItem')
export class PaymentOverviewTotalsItem {
  @Field(() => String, { nullable: true })
  serviceTypeCode!: string | null

  @Field(() => Number, { nullable: true })
  fullCost!: number

  @Field(() => Number, { nullable: true })
  copayCost!: number

  @Field(() => Number, { nullable: true })
  patientCost!: number
}

