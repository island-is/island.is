import {
  Field,
  GraphQLISODateTime,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { IncomeCategory } from './category.model'
import { IncomePlanStatus } from '../../socialInsurance.type'

registerEnumType(IncomePlanStatus, { name: 'SocialInsuranceIncomePlanStatus' })

@ObjectType('SocialInsuranceIncomePlan')
export class IncomePlan {
  @Field(() => GraphQLISODateTime)
  registrationDate!: Date

  @Field(() => IncomePlanStatus)
  status!: IncomePlanStatus

  @Field(() => [IncomeCategory])
  incomeCategories!: Array<IncomeCategory>
}
