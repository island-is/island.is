import { Field, ObjectType } from '@nestjs/graphql'
import { CopaymentInsuranceStatus } from './copaymentInsuranceStatus.model'

@ObjectType('RightsPortalCopaymentStatus')
export class CopaymentStatus {
  @Field(() => CopaymentInsuranceStatus, { nullable: true })
  insuranceStatus?: CopaymentInsuranceStatus | null

  @Field(() => Number, { nullable: true })
  maximumMonthlyPayment?: number | null

  @Field(() => Number, { nullable: true })
  maximumPayment?: number | null

  @Field(() => Number, { nullable: true })
  basePayment?: number | null
}
