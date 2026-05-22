import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'

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

  @Field(() => Int, {
    nullable: true,
    description:
      'Month number (1–12) of the scheduled assessment sitting. Only present for assessments with multiple sittings per year; absent for annual assessments.',
  })
  monthNumber?: number
}
