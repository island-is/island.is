import {
  Field,
  GraphQLISODateTime,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { IncomeCategory } from './category.model'
import { IncomePlanStatus } from '../../socialInsurance.type'
import { IncomePlanEligbility } from './incomePlanEligibility.model'

registerEnumType(IncomePlanStatus, { name: 'SocialInsuranceIncomePlanStatus' })

@ObjectType('SocialInsuranceIncomePlan')
export class IncomePlan {
  @Field(() => GraphQLISODateTime)
  registrationDate!: Date

  @Field(() => IncomePlanStatus)
  status!: IncomePlanStatus

  @Field(() => IncomePlanEligbility, { nullable: true })
  isEligibleForChange?: IncomePlanEligbility

  @Field(() => [IncomeCategory])
  incomeCategories!: Array<IncomeCategory>
}
