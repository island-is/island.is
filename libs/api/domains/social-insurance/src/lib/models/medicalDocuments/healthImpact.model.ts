import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsHealthImpact')
export class HealthImpact {
  @Field({ nullable: true })
  description?: string

  @Field(() => Int, { nullable: true })
  impactLevel?: number
}
