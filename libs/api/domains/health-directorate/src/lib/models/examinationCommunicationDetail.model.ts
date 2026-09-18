import { Field, Float, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { CommunicationKindEnum } from './enums'
import { CommunicationStaffRef } from './communicationStaffRef.model'
import { FetalHeartRate } from './fetalHeartRate.model'

@ObjectType('HealthDirectorateExaminationCommunicationDetail')
export class ExaminationCommunicationDetail {
  @Field(() => ID)
  id!: string

  @Field(() => CommunicationKindEnum)
  kind!: CommunicationKindEnum

  @Field(() => Int, { nullable: true })
  weeks?: number

  @Field(() => Int, { nullable: true })
  days?: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTime?: Date

  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  authorName?: string

  @Field({
    nullable: true,
    description: 'Short subject/reason term for the entry (subject.term upstream).',
  })
  subjectTerm?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date

  @Field(() => CommunicationStaffRef, { nullable: true })
  registeredBy?: CommunicationStaffRef

  @Field(() => Float, { nullable: true })
  weight?: number

  @Field(() => Int, { nullable: true })
  pulse?: number

  @Field(() => Int, { nullable: true })
  bloodPressureUpper?: number

  @Field(() => Int, { nullable: true })
  bloodPressureLower?: number

  @Field(() => Float, {
    nullable: true,
    description: 'Not a 0-10 style score — a raw hemoglobin measurement (g/L).',
  })
  hemoglobinScore?: number

  @Field({
    nullable: true,
    description:
      'Source mixes label strings ("Neikvætt") and comma-decimal entries ("1,0 ++") — exposed as raw string.',
  })
  albumenInUrineScore?: string

  @Field(() => Float, {
    nullable: true,
    description: 'Fundal height, not cervix height, despite the field name.',
  })
  cervixHeight?: number

  @Field(() => [FetalHeartRate])
  fetalHeartRates!: FetalHeartRate[]
}
