import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { PreviousApplication } from './previousApplication.model'
import { RequestedPeriod } from './requestedPeriod.model'
import { RequestedTreatment } from './requestedTreatment.model'
import { ServiceProvider } from './serviceProvider.model'

@ObjectType('SocialInsuranceMedicalDocumentsConfirmationOfPendingResolution')
export class ConfirmationOfPendingResolution {
  @Field({ nullable: true })
  referenceId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  created?: Date

  @Field(() => ServiceProvider, { nullable: true })
  serviceProvider?: ServiceProvider

  @Field(() => RequestedTreatment, { nullable: true })
  requestedTreatment?: RequestedTreatment

  @Field({ nullable: true })
  treatmentExplanation?: string

  @Field(() => PreviousApplication, { nullable: true })
  previousApplication?: PreviousApplication

  @Field(() => RequestedPeriod, { nullable: true })
  requestedPeriod?: RequestedPeriod

  @Field({ nullable: true })
  typeAppliedFor?: string
}
