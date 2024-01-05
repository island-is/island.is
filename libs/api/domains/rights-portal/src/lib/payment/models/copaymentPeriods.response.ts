import { Field, ObjectType } from '@nestjs/graphql'
import { CopaymentPeriod } from './copaymentPeriod.model'
import { PaymentError } from './paymentError.model'

@ObjectType('RightsPortalCopaymentPeriodResponse')
export class CopaymentPeriodResponse {
  @Field(() => [CopaymentPeriod])
  items!: CopaymentPeriod[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
