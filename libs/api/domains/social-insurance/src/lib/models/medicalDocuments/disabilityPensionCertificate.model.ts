import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Doctor } from './doctor.model'
import { DisabilityDiagnosisCollection } from './disabilityDiagnosisCollection.model'
import { ImpairmentRatingDomain } from './impairmentRatingDomain.model'

@ObjectType('SocialInsuranceMedicalDocumentsDisabilityPensionCertificate')
export class DisabilityPensionCertificate {
  @Field()
  referenceId!: string

  @Field({ nullable: true })
  healthCenter?: string

  @Field({ nullable: true })
  createdAt?: Date

  @Field(() => Doctor, { nullable: true })
  doctor?: Doctor

  @Field({ nullable: true, description: 'ISO8601 formatted date' })
  lastInspectionDate?: string

  @Field({ nullable: true, description: 'ISO8601 formatted date' })
  certificateDate?: string

  @Field({ nullable: true, description: 'ISO8601 formatted date' })
  dateOfWorkIncapacity?: string

  @Field(() => DisabilityDiagnosisCollection, { nullable: true })
  diagnoses?: DisabilityDiagnosisCollection

  @Field({ nullable: true })
  healthHistorySummary?: string

  @Field({ nullable: true })
  participationLimitationCause?: string

  @Field({ nullable: true })
  stabilityOfHealth?: string

  @Field({ nullable: true })
  abilityChangePotential?: string

  @Field({ nullable: true })
  medicationAndSupports?: string

  @Field({ nullable: true })
  assessmentToolsUsed?: string

  @Field(() => Int, { nullable: true })
  capacityForWork?: number

  @Field({ nullable: true })
  previousRehabilitation?: string

  @Field(() => ImpairmentRatingDomain, { nullable: true })
  physicalImpairments?: ImpairmentRatingDomain

  @Field(() => ImpairmentRatingDomain, { nullable: true })
  mentalImpairments?: ImpairmentRatingDomain
}
