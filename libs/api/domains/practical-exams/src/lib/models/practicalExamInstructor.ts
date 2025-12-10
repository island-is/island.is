import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('PracticalExamInstructor')
export class PracticalExamInstructor {
  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => [String], { nullable: true })
  categoriesMayTeach?: string | null
}
