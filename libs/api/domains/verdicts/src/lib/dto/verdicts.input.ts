import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType('WebVerdictsInput')
@ObjectType('WebVerdictsInputResponse')
export class VerdictsInput {
  @Field(() => String, { nullable: true })
  searchTerm?: string

  @Field(() => String, { nullable: true })
  courtLevel?: string

  @Field(() => String, { nullable: true })
  caseNumber?: string

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => [String], { nullable: true })
  caseTypes?: string[]

  @Field(() => [String], { nullable: true })
  caseCategories?: string[]

  @Field(() => [String], { nullable: true })
  keywords?: string[]

  @Field(() => [String], { nullable: true })
  laws?: string[]

  @Field(() => String, { nullable: true })
  dateFrom?: string

  @Field(() => String, { nullable: true })
  dateTo?: string

  @Field(() => String, { nullable: true })
  caseContact?: string
}
