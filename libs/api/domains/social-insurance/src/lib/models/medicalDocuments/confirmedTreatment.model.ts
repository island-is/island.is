import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { PreviousApplication } from './previousApplication.model'
import { RequestedPeriod } from './requestedPeriod.model'
import { RequestedTreatment } from './requestedTreatment.model'
import { ServiceProvider } from './serviceProvider.model'

@ObjectType('SocialInsuranceMedicalDocumentsConfirmedTreatment')
export class ConfirmedTreatment {
  @Field({ nullable: true })
  referenceId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  created?: Date

  @Field(() => ServiceProvider, { nullable: true })
  serviceProvider?: ServiceProvider

  @Field(() => RequestedTreatment, { nullable: true })
  requestedTreatment?: RequestedTreatment

  @Field(() => PreviousApplication, { nullable: true })
  previousApplication?: PreviousApplication

  @Field(() => RequestedPeriod, { nullable: true })
  requestedPeriod?: RequestedPeriod

  @Field({ nullable: true })
  typeAppliedFor?: string
}
