import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PrimarySchoolAssessmentType {
  @Field(() => ID)
  id!: string

  @Field()
  identifier!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  testType?: string
}
