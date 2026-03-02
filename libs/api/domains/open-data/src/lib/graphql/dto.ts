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

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  limit?: number
}
