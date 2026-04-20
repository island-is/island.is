import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationPrimarySchoolAssessmentPeriod')
export class PrimarySchoolAssessmentPeriod {
  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field({
    nullable: true,
    description:
      'Human-readable label for the assessment period (e.g. "sep.", "jan.", "maí"). Pre-formatted by the API; use this for display instead of formatting startDate.',
  })
  startDateString?: string
}
