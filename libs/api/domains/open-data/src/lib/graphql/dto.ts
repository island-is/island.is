import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('GetOpenDataDatasetsInput')
export class GetOpenDataDatasetsInput {
  @Field({ nullable: true })
  searchQuery?: string

  @Field(() => [String], { nullable: true })
  categories?: string[]

  @Field(() => [String], { nullable: true })
  publishers?: string[]

  @Field(() => [String], { nullable: true })
  formats?: string[]

  @Field(() => [String], { nullable: true })
  status?: string[]

  @Field(() => [String], { nullable: true })
  license?: string[]

  @Field(() => [String], { nullable: true })
  groups?: string[]

  @Field({ nullable: true })
  lastUpdated?: string

  @Field(() => [String], { nullable: true })
  updateFrequency?: string[]

  @Field(() => [String], { nullable: true })
  timePeriod?: string[]

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
