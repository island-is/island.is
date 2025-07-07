import { Field, GraphQLISODateTime, ObjectType, Int } from '@nestjs/graphql'
import { EnumType } from './enumType.model'

@ObjectType('SocialInsuranceMedicalDocumentsDoctor')
class Doctor {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  doctorNumber?: string

  @Field({ nullable: true })
  residence?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsDiagnosis')
class Diagnosis {
  @Field(() => [String], { nullable: true })
  icd?: Array<string>

  @Field(() => [String], { nullable: true })
  others?: Array<string>
}

@ObjectType('SocialInsuranceMedicalDocumentsDifficulty')
class Difficulty {
  @Field(() => Int, { nullable: true })
  value?: number

  @Field({ nullable: true })
  explanation?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsEstimatedDuration')
class EstimatedDuration {
  @Field(() => GraphQLISODateTime, { nullable: true })
  start?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  end?: Date

  @Field(() => Int, { nullable: true })
  months?: number
}

@ObjectType('SocialInsuranceMedicalDocumentsConfirmation')
class Confirmation {
  @Field(() => EnumType, { nullable: true })
  type?: EnumType

  @Field({ nullable: true })
  typeName?: string

  @Field(() => [String], { nullable: true })
  treatmentMeasures?: Array<string>

  @Field({ nullable: true })
  explanation?: string

  @Field({ nullable: true })
  progress?: string

  @Field(() => EstimatedDuration, { nullable: true })
  estimatedDuration?: EstimatedDuration
}

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
