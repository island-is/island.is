import { Field, ObjectType } from '@nestjs/graphql'
import { ImpairmentRating } from './impairmentRating.model'

@ObjectType('SocialInsuranceMedicalDocumentsImpairmentRatingDomain')
export class ImpairmentRatingDomain {
  @Field()
  title!: string

  @Field(() => [ImpairmentRating])
  ratings!: ImpairmentRating[]
}
