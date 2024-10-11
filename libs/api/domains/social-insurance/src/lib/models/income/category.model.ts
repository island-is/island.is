import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceIncomePlanIncomeCategory')
export class IncomeCategory {
  @Field()
  name!: string

  @Field()
  typeName!: string

  @Field(() => Int)
  annualSum!: number

  @Field({ nullable: true })
  currency?: string
}
