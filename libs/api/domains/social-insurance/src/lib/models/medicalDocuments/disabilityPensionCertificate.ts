import { ObjectType, Field, GraphQLISODateTime, Int } from "@nestjs/graphql"
import { Doctor } from "./doctor.model"
import { DisabilityDiagnosisCollection } from "./disabilityDiagnosisCollection.model"
import { HealthImpact } from "./healthImpact.model"
import { AbilityRating } from "./abilityRating.model"
import { Impairment } from "./impairment.model"
import { EnvironmentalFactor } from "./environmentalFactor.model"

@ObjectType(
  'SocialInsuranceMedicalDocumentsDisabilityPensionCertificate',
)
export class DisabilityPensionCertificate {
  @Field()
  referenceId!: string

  @Field(() => Doctor, { nullable: true })
  doctor?: Doctor

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastInspectionDate?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  certificateDate?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateOfWorkIncapacity?: string

  @Field(() => DisabilityDiagnosisCollection, { nullable: true })
  diagnoses?: DisabilityDiagnosisCollection

  @Field({ nullable: true })
  healthHistorySummary?: string

  @Field(() => HealthImpact, { nullable: true })
  healthImpact?: HealthImpact

  @Field(() => Int, { nullable: true })
  participationLimitationCause?: number

  @Field(() => Int, { nullable: true })
  abilityChangePotential?: number

  @Field({ nullable: true })
  medicationAndSupports?: string

  @Field({ nullable: true })
  assessmentToolsUsed?: string

  @Field(() => [AbilityRating], { nullable: true })
  physicalAbilityRatings?: AbilityRating[]

  @Field(() => [AbilityRating], { nullable: true })
  cognitiveAndMentalAbilityRatings?: AbilityRating[]

  @Field(() => [AbilityRating], { nullable: true })
  functionalAssessment?: AbilityRating[]

  @Field(() => [Impairment], { nullable: true })
  impairments?: Impairment[]

  @Field(() => [EnvironmentalFactor], { nullable: true })
  environmentalFactors?: EnvironmentalFactor[]

}
