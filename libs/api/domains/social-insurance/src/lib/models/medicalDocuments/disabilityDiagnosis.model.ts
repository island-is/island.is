import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsDisabilityDiagnosis')
export class DisabilityDiagnosis {
  @Field()
  code!: string

  @Field({ nullable: true })
  description?: string
}
