import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsImpairmentRating')
export class ImpairmentRating {
  @Field()
  title!: string

  @Field()
  value!: string
}
