import { Field, ObjectType } from '@nestjs/graphql'
import { PreviousApplication } from './previousApplication.model'
import { RequestedPeriod } from './requestedPeriod.model'
import { ServiceProvider } from './serviceProvider.model'

@ObjectType('SocialInsuranceMedicalDocumentsConfirmationOfIllHealth')
export class ConfirmationOfIllHealth {
  @Field({ nullable: true })
  referenceId?: string

  @Field(() => ServiceProvider, { nullable: true })
  serviceProvider?: ServiceProvider

  @Field({ nullable: true })
  currentMedicalStatus?: string

  @Field(() => PreviousApplication, { nullable: true })
  previousApplication?: PreviousApplication

  @Field(() => RequestedPeriod, { nullable: true })
  requestedPeriod?: RequestedPeriod
}
