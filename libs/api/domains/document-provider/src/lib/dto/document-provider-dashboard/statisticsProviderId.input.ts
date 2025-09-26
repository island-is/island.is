import { Field, Int, InputType } from '@nestjs/graphql'

@InputType('GetStatisticsCategoriesByProviderId')
export class GetStatisticsCategoriesByProviderId {
  
  @Field()
  providerId!: string

  @Field(() => [Int], { nullable: true })
  categories?: Array<number>

  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date
}
