import { Field, ObjectType } from '@nestjs/graphql'
import { EnumType } from './enumType.model'

@ObjectType('SocialInsuranceMedicalDocumentsRequestedTreatment')
export class RequestedTreatment {
  @Field(() => [EnumType], { nullable: true })
  treatmentTypes?: Array<EnumType>

  @Field({ nullable: true })
  otherTreatmentDescription?: string
}
