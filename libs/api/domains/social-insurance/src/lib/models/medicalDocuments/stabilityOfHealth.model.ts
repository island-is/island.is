import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsStabilityOfHealth')
export class StabilityOfHealth {
  @Field()
  description!: string

  @Field({ nullable: true })
  furtherDetails?: string
}
