import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType('WebVerdictsInput')
@ObjectType('WebVerdictsInputResponse')
export class VerdictsInput {
  @Field(() => String, { nullable: true })
  searchTerm?: string

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => [Int], { nullable: true })
  caseTypeIds?: number[]

  @Field(() => [Int], { nullable: true })
  caseCategoryIds?: number[]

  @Field(() => [Int], { nullable: true })
  keywordIds?: number[]
}
