import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsServiceProviderModel')
class ServiceProviderModel {
  @Field({ nullable: true })
  serviceProviderName?: string

  @Field({ nullable: true })
  coordinatorName?: string

  @Field({ nullable: true })
  coordinatorTitle?: string

  @Field({ nullable: true })
  workplace?: string

  @Field({ nullable: true })
  phoneNumber?: string
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
  @Field(() => ServiceProviderModel, { nullable: true })
  serviceProvider?: ServiceProviderModel

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
