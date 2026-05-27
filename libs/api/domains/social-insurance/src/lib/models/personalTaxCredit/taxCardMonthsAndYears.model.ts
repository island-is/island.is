import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceYearWithMonths')
export class YearWithMonths {
  @Field(() => Int)
  year!: number

  @Field(() => [Int], { description: 'Month numbers 1–12 (1 = January)' })
  months!: number[]
}
