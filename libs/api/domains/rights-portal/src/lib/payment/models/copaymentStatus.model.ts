import { Field, ObjectType } from '@nestjs/graphql'
import { CopaymentInsuranceStatus } from './copaymentInsuranceStatus.model'

@ObjectType('RightsPortalCopaymentStatus')
export class CopaymentStatus {
  @Field(() => CopaymentInsuranceStatus, { nullable: true })
  insuranceStatus?: CopaymentInsuranceStatus

  @Field(() => Number, { nullable: true })
  maximumMonthlyPayment?: number

  @Field(() => Number, { nullable: true })
  maximumPayment?: number

  @Field(() => Number, { nullable: true })
  basePayment?: number
}
