import { Field, ObjectType } from '@nestjs/graphql'
import { CopaymentStatus } from './copaymentStatus.model'
import { PaymentError } from './paymentError.model'

@ObjectType('RightsPortalCopaymentStatusResponse')
export class CopaymentStatusResponse {
  @Field(() => [CopaymentStatus])
  items!: CopaymentStatus[]

  @Field(() => [PaymentError])
  errors!: PaymentError[]
}
