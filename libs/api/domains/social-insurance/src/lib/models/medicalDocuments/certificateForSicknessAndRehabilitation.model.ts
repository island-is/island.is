import { Field, ObjectType } from '@nestjs/graphql'
import { Doctor } from './doctor.model'
import { Confirmation } from './confirmation.model'
import { Diagnosis } from './diagnosis.model'
import { Difficulty } from './difficulty.model'


@ObjectType(
  'SocialInsuranceMedicalDocumentsCertificateForSicknessAndRehabilitation',
)
export class CertificateForSicknessAndRehabilitation {
  @Field({ nullable: true })
  referenceId?: string

  @Field(() => Doctor, { nullable: true })
  doctor?: Doctor

  @Field(() => Date, { nullable: true })
  lastExaminationDate?: Date

  @Field(() => Date, { nullable: true })
  certificateDate?: Date

  @Field(() => Date, { nullable: true })
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

  @Field(() => Confirmation, { nullable: true })
  confirmation?: Confirmation
}
