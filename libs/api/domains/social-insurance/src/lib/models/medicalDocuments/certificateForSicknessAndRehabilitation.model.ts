import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql'
import { Diagnosis } from './diagnosis.model'
import { Difficulty } from './difficulty.model'
import { Doctor } from './doctor.model'

@ObjectType(
  'SocialInsuranceMedicalDocumentsCertificateForSicknessAndRehabilitation',
)
export class CertificateForSicknessAndRehabilitation {
  @Field({ nullable: true })
  referenceId?: string

  @Field(() => Doctor, { nullable: true })
  doctor?: Doctor

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastExaminationDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  certificateDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  disabilityDate?: Date

  @Field(() => Diagnosis, { nullable: true })
  diagnoses?: Diagnosis

  @Field({ nullable: true })
  previousHealthHistory?: string

  @Field({ nullable: true })
  currentStatus?: string

  @Field(() => Difficulty, { nullable: true })
  physicalDifficulty?: Difficulty

  @Field(() => Difficulty, { nullable: true })
  mentalDifficulty?: Difficulty

  @Field(() => Difficulty, { nullable: true })
  activityParticipationDifficulty?: Difficulty

  @Field({ nullable: true })
  other?: string

  @Field({ nullable: true })
  isAlmaCertificate?: boolean
}
