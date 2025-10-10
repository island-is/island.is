import { Field, Int, InputType, GraphQLISODateTime } from '@nestjs/graphql'

@InputType('GetStatisticsCategoriesByProviderId')
export class GetStatisticsCategoriesByProviderId {
  @Field()
  providerId!: string

  @Field(() => [Int], { nullable: true })
  categories?: Array<number>

  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date
}
