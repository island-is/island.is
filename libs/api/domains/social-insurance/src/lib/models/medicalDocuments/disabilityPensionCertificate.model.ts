import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Doctor } from './doctor.model'
import { DisabilityDiagnosisCollection } from './disabilityDiagnosisCollection.model'
import { ImpairmentRating } from './impairmentRating.model'
import { MedicationAndSupportsUsed } from './medicationAndSupportsUsed.model'
import { StabilityOfHealth } from './stabilityOfHealth.model'

@ObjectType('SocialInsuranceMedicalDocumentsDisabilityPensionCertificate')
export class DisabilityPensionCertificate {
  @Field()
  referenceId!: string

  @Field(() => Doctor, { nullable: true })
  doctor?: Doctor

  @Field({ nullable: true, description: 'ISO8601 formatted date' })
  dateOfWorkIncapacity?: string

  @Field(() => DisabilityDiagnosisCollection, { nullable: true })
  diagnoses?: DisabilityDiagnosisCollection

  @Field({ nullable: true })
  healthHistorySummary?: string

  @Field({ nullable: true })
  participationLimitationCause?: string

  @Field(() => StabilityOfHealth, { nullable: true })
  stabilityOfHealth?: StabilityOfHealth

  @Field({ nullable: true })
  abilityChangePotential?: string

  @Field(() => MedicationAndSupportsUsed, { nullable: true })
  medicationAndSupportsUsed?: MedicationAndSupportsUsed

  @Field(() => Int, { nullable: true })
  capacityForWork?: number

  @Field({ nullable: true })
  previousRehabilitation?: string

  @Field(() => [ImpairmentRating], { nullable: true })
  physicalImpairments?: ImpairmentRating[]

  @Field(() => [ImpairmentRating], { nullable: true })
  mentalImpairments?: ImpairmentRating[]
}
