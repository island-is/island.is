import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TestType } from '../../enums/primarySchool.enum'

@ObjectType('EducationPrimarySchoolAssessmentType')
export class PrimarySchoolAssessmentType {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  identifier?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => TestType, { nullable: true })
  testType?: TestType

  // Internal property for threading studentId through field resolvers — not exposed in GraphQL schema
  studentId?: string
}
