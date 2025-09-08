import { ObjectType, Field } from '@nestjs/graphql'
import { EnumType } from './enumType.model'
import { EstimatedDuration } from './estimatedDuration.model'

@ObjectType('SocialInsuranceMedicalDocumentsConfirmation')
export class Confirmation {
  @Field(() => EnumType, { nullable: true })
  type?: EnumType

  @Field({ nullable: true })
  typeName?: string

  @Field(() => [String], { nullable: true })
  treatmentMeasures?: Array<string>

  @Field({ nullable: true })
  explanation?: string

  @Field({ nullable: true })
  progress?: string
}
