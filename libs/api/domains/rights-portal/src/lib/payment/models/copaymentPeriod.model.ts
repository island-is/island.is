import { Field, ObjectType } from '@nestjs/graphql'
import { CopaymentInsuranceStatus } from './copaymentInsuranceStatus.model'

@ObjectType('RightsPortalCopaymentPeriod')
export class CopaymentPeriod {
  @Field(() => Number, { nullable: true })
  id?: number | null

  @Field(() => CopaymentInsuranceStatus, { nullable: true })
  status?: CopaymentInsuranceStatus | null

  @Field(() => String, { nullable: true })
  month?: string | null

  @Field(() => Number, { nullable: true })
  maximumPayment?: number | null

  @Field(() => Number, { nullable: true })
  monthPayment?: number | null

  @Field(() => Number, { nullable: true })
  overpaid?: number | null

  @Field(() => Number, { nullable: true })
  repaid?: number | null
}
