import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalPaymentOverviewDocument')
export class PaymentOverviewDocument {
  @Field(() => String, { nullable: true })
  contentType?: string | null

  @Field(() => String, { nullable: true })
  fileName?: string | null

  @Field(() => String, { nullable: true })
  data?: string | null
}
