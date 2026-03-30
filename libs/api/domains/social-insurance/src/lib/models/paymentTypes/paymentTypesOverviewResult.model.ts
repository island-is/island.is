import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentTypeOverview } from './paymentTypeOverview.model'
import { BenefitChildInformation } from './benefitChildInformation.model'

@ObjectType('SocialInsurancePaymentTypesOverviewResult')
export class PaymentTypesOverviewResult {
  @Field(() => [PaymentTypeOverview], { nullable: true })
  paymentTypes?: PaymentTypeOverview[]

  @Field(() => [BenefitChildInformation], { nullable: true })
  benefitChildren?: BenefitChildInformation[]
}
