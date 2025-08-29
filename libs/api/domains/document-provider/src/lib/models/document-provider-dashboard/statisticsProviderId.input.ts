import { Field, GraphQLISODateTime, ID, Int, InputType } from '@nestjs/graphql'

@InputType('ApiV1StatisticsNationalIdProvidersProviderIdGetRequest')
export class ApiV1StatisticsNationalIdProvidersProviderIdGetRequest {
  @Field()
  nationalId!: string
  @Field()
  providerId!: string

  @Field(() => [Int], { nullable: true })
  categories?: Array<number>

  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date
}
