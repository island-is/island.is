import { Field, Float, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationPrimarySchoolAssignmentResult')
export class PrimarySchoolAssignmentResult {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true, description: 'Name of the assignment' })
  name?: string

  @Field(() => Int, {
    nullable: true,
    description:
      'Batch number for this assignment result. For reading ability: 1 = September, 2 = January, 3 = May.',
  })
  batchNumber?: number

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Date this assessment sitting was scheduled to start',
  })
  startDate?: Date

  @Field({
    nullable: true,
    description:
      'Human-readable label for the schedule period (e.g. "September", "Spring")',
  })
  schedule?: string

  @Field(() => Float, {
    nullable: true,
    description:
      'Raw score for this assignment (e.g. words per minute, number of correct answers)',
  })
  score?: number

  @Field({ nullable: true })
  schoolName?: string

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Date the evaluation was conducted',
  })
  evaluationDate?: Date

  @Field(() => Float, {
    nullable: true,
    description:
      'Normalized score (mælitala) — maps the raw score to a final result on a standardized scale',
  })
  evaluationScore?: number

  @Field({
    nullable: true,
    description:
      'Human-readable label for the score range (e.g. "Below average", "Average", "Above average")',
  })
  evaluationScoreRange?: string
}
