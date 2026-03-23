import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceYearWithMonths')
export class YearWithMonths {
  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => [Int], { nullable: true })
  months?: number[] | null
}
