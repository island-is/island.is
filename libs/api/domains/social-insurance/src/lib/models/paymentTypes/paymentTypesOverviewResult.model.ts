import { Field, ObjectType } from '@nestjs/graphql'
import { PaymentTypeOverview } from './paymentTypeOverview.model'
import { ChildBenefitInformation } from './childBenefitInformation.model'

@ObjectType('SocialInsurancePaymentTypesOverviewResult')
export class PaymentTypesOverviewResult {
  @Field(() => [PaymentTypeOverview], { nullable: true })
  paymentTypes?: PaymentTypeOverview[]

  @Field(() => [ChildBenefitInformation], { nullable: true })
  childBenefits?: ChildBenefitInformation[]
}
