import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewStatus')
export class PaymentOverviewStatus {
  @Field(() => Number, { nullable: true })
  credit?: number | null

  @Field(() => Number, { nullable: true })
  debit?: number | null
}
