import { Field, ObjectType } from '@nestjs/graphql'
import { EnumType } from './enumType.model'
import { PreviousApplication } from './previousApplication.model'
import { RequestedPeriod } from './requestedPeriod.model'
import { ServiceProvider } from './serviceProvider.model'

@ObjectType('SocialInsuranceMedicalDocumentsRequestedTreatment')
class RequestedTreatment {
  @Field(() => EnumType, { nullable: true })
  treatmentType?: EnumType

  @Field({ nullable: true })
  otherTreatmentDescription?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsConfirmationOfPendingResolution')
export class ConfirmationOfPendingResolution {
  @Field({ nullable: true })
  referenceId?: string

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
}
