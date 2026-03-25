import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationPrimarySchoolAssessmentPeriod')
export class PrimarySchoolAssessmentPeriod {
  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field({ nullable: true })
  startDateString?: string
}
