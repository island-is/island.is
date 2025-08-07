import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsPreviousApplication')
export class PreviousApplication {
  @Field({ nullable: true })
  hasPreviousApproval?: boolean

  @Field({ nullable: true })
  additionalDetails?: string
}
