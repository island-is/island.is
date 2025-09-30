import { ObjectType, Field } from '@nestjs/graphql'
import { EnvironmentalCategory } from '../../enums'

@ObjectType('SocialInsuranceMedicalDocumentsEnvironmentalFactor')
export class EnvironmentalFactor {
  @Field(() => EnvironmentalCategory, { nullable: true })
  category?: EnvironmentalCategory

  @Field({ nullable: true })
  keyNumber?: string

  @Field({ nullable: true })
  description?: string
}
