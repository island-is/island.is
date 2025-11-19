import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { EnumType } from './enumType.model'
import { ServiceProvider } from './serviceProvider.model'

@ObjectType('SocialInsuranceMedicalDocumentsFollowUpEvaluation')
class FollowUpEvaluation {
  @Field(() => EnumType, { nullable: true })
  rehabilitationProgress?: EnumType

  @Field({ nullable: true })
  rehabilitationProgressDetails?: string

  @Field(() => EnumType, { nullable: true })
  rehabilitationMeasuresProgress?: EnumType

  @Field({ nullable: true })
  rehabilitationMeasuresProgressDetails?: string

  @Field(() => EnumType, { nullable: true })
  rehabilitationChanges?: EnumType

  @Field({ nullable: true })
  rehabilitationChangesDetails?: string

  @Field(() => EnumType, { nullable: true })
  applicantCircumstancesChanges?: EnumType

  @Field({ nullable: true })
  applicantCircumstancesChangesDetails?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsComprehensiveEvaluation')
class ComprehensiveEvaluation {
  @Field(() => [EnumType], { nullable: true })
  evaluationScale?: Array<EnumType>

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

  @Field(() => Int, { nullable: true })
  expression?: number
}

@ObjectType('SocialInsuranceMedicalDocumentsHealthGoals')
class HealthGoals {
  @Field({ nullable: true })
  goalDescription?: string

  @Field(() => [String], { nullable: true })
  measures?: Array<string>
}

@ObjectType('SocialInsuranceMedicalDocumentsRehabilitationPlan')
export class RehabilitationPlan {
  @Field({ nullable: true })
  referenceId?: string

  @Field(() => ServiceProvider, { nullable: true })
  serviceProvider?: ServiceProvider

  @Field(() => EnumType, { nullable: true })
  applicantEmploymentStatus?: EnumType

  @Field(() => FollowUpEvaluation, { nullable: true })
  followUpEvaluation?: FollowUpEvaluation

  @Field(() => ComprehensiveEvaluation, { nullable: true })
  comprehensiveEvaluation?: ComprehensiveEvaluation

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  plannedEndDate?: Date

  @Field({ nullable: true })
  rehabilitationFocusAndStrategy?: string

  @Field(() => HealthGoals, { nullable: true })
  physicalHealthGoals?: HealthGoals

  @Field(() => HealthGoals, { nullable: true })
  mentalHealthGoals?: HealthGoals

  @Field(() => HealthGoals, { nullable: true })
  activityAndParticipationGoals?: HealthGoals

  @Field({ nullable: true })
  typeAppliedFor?: string
}
