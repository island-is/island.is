import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { RequestedPeriod } from './requestedPeriod.model'
import { ServiceProvider } from './serviceProvider.model'

@ObjectType('SocialInsuranceMedicalDocumentsConfirmationOfJobSearch')
export class ConfirmationOfJobSearch {
  @Field({ nullable: true })
  referenceId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  created?: Date

  @Field(() => ServiceProvider, { nullable: true })
  serviceProvider?: ServiceProvider

  @Field(() => RequestedPeriod, { nullable: true })
  requestedPeriod?: RequestedPeriod

  @Field({ nullable: true })
  typeAppliedFor?: string
}
