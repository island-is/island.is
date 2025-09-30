import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsAbilityRating')
export class AbilityRating {
  @Field(() => Int, { nullable: true })
  type?: number

  @Field(() => Int, { nullable: true })
  score?: number
}
