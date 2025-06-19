import { Field, ObjectType, GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsServiceProvider')
class ServiceProvider {
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

@ObjectType('SocialInsuranceMedicalDocumentsHealthGoals')
class HealthGoals {
  @Field({ nullable: true })
  goalDescription?: string

  @Field(() => [String], { nullable: true })
  measures?: string[] | null
}

@ObjectType('SocialInsuranceMedicalDocumentsRehabilitationPlan')
export class RehabilitationPlan {
  @Field(() => ServiceProvider, { nullable: true })
  serviceProvider?: ServiceProvider

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
}
