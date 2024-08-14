import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { IncomeCategory } from './category.model'

@ObjectType('SocialInsuranceIncomePlan')
export class IncomePlan {
  @Field(() => GraphQLISODateTime)
  registrationDate!: Date

  @Field()
  status!: string

  @Field(() => [IncomeCategory])
  incomeCategories!: Array<IncomeCategory>
}
