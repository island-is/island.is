import { Field, Float, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationPrimarySchoolAssignmentEvaluation')
export class PrimarySchoolAssignmentEvaluation {
  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Date the evaluation was conducted',
  })
  date?: Date

  @Field(() => Float, {
    nullable: true,
    description:
      'Normalized score (mælitala) — maps the raw score to a final result on a standardized scale',
  })
  score?: number

  @Field({
    nullable: true,
    description:
      'Human-readable label for the score range (e.g. "Below average", "Average", "Above average")',
  })
  scoreRange?: string
}
