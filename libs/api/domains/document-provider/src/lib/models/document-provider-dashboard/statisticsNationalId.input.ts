import { Field, GraphQLISODateTime, ID, Int, InputType } from '@nestjs/graphql'

@InputType('ApiV1StatisticsNationalIdGetRequest')
export class ApiV1StatisticsNationalIdGetRequest {
  @Field()
  nationalId!: string

  @Field(() => [Int], { nullable: true })
  categories?: Array<number>

  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date
}
