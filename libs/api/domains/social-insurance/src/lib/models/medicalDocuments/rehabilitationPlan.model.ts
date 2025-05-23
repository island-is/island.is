import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsPersonModel')
class PersonModel {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  postalCode?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  email?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsServiceProviderModel')
class ServiceProviderModel {
  @Field({ nullable: true })
  serviceProviderName?: string

  @Field({ nullable: true })
  coordinatorName?: string

  @Field({ nullable: true })
  coordinatorNationalId?: string

  @Field({ nullable: true })
  coordinatorTitle?: string

  @Field({ nullable: true })
  workplace?: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field({ nullable: true })
  email?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsFirstEvaluationModel')
class FirstEvaluationModel {
  @Field({ nullable: true })
  applicantStatus?: string

  @Field({ nullable: true })
  previousMedicalOrRehab?: string

  @Field(() => Int, { nullable: true })
  attitudeTowardsWork?: number
}

@ObjectType('SocialInsuranceMedicalDocumentsFollowUpEvaluationModel')
class FollowUpEvaluationModel {
  @Field(() => Int, { nullable: true })
  rehabilitationProgress?: number

  @Field({ nullable: true })
  rehabilitationProgressDetails?: string

  @Field(() => Int, { nullable: true })
  rehabilitationMeasuresProgress?: number

  @Field({ nullable: true })
  rehabilitationMeasuresProgressDetails?: string

  @Field(() => Int, { nullable: true })
  rehabilitationChanges?: number

  @Field({ nullable: true })
  rehabilitationChangesDetails?: string

  @Field(() => Int, { nullable: true })
  applicantCircumstancesChanges?: number

  @Field({ nullable: true })
  applicantCircumstancesChangesDetails?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsComprehensiveEvaluationModel')
class ComprehensiveEvaluationModel {
  @Field(() => Int, { nullable: true })
  learningAndApplyingKnowledge?: number

  @Field(() => Int, { nullable: true })
  generalTasksAndDemands?: number

  @Field(() => Int, { nullable: true })
  communicationAndRelationships?: number

  @Field(() => Int, { nullable: true })
  mobility?: number

  @Field(() => Int, { nullable: true })
  selfCare?: number

  @Field(() => Int, { nullable: true })
  domesticLife?: number

  @Field(() => Int, { nullable: true })
  mainDailyLifeAreas?: number

  @Field(() => Int, { nullable: true })
  leisureAndHobbies?: number
}

@ObjectType('SocialInsuranceMedicalDocumentsHealthGoalsModel')
class HealthGoalsModel {
  @Field({ nullable: true })
  goalDescription?: string

  @Field({ nullable: true })
  measures?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsRehabilitationPlanModel')
export class RehabilitationPlanModel {
  @Field(() => PersonModel, { nullable: true })
  person?: PersonModel

  @Field(() => ServiceProviderModel, { nullable: true })
  serviceProvider?: ServiceProviderModel

  @Field(() => Int, { nullable: true })
  applicantEmploymentStatus?: number

  @Field(() => FirstEvaluationModel, { nullable: true })
  firstEvaluation?: FirstEvaluationModel

  @Field(() => FollowUpEvaluationModel, { nullable: true })
  followUpEvaluation?: FollowUpEvaluationModel

  @Field(() => ComprehensiveEvaluationModel, { nullable: true })
  comprehensiveEvaluation?: ComprehensiveEvaluationModel

  @Field(() => Date, { nullable: true })
  startDate?: Date

  @Field(() => Date, { nullable: true })
  plannedEndDate?: Date

  @Field({ nullable: true })
  rehabilitationFocusAndStrategy?: string

  @Field(() => HealthGoalsModel, { nullable: true })
  physicalHealthGoals?: HealthGoalsModel

  @Field(() => HealthGoalsModel, { nullable: true })
  mentalHealthGoals?: HealthGoalsModel

  @Field(() => HealthGoalsModel, { nullable: true })
  activityAndParticipationGoals?: HealthGoalsModel
}
