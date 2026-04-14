import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceYearWithMonths')
export class YearWithMonths {
  @Field(() => Int)
  year!: number

  @Field(() => [Int])
  months!: number[]
}
