import { ObjectType, Field } from '@nestjs/graphql'
import { MedicalDocumentFunction } from './function.model'
import { ImpairmentType } from '../../enums'

@ObjectType('SocialInsuranceMedicalDocumentsImpairment')
export class Impairment {
  @Field(() => ImpairmentType, { nullable: true })
  type?: ImpairmentType

  @Field(() => [MedicalDocumentFunction], { nullable: true })
  functions?: MedicalDocumentFunction[]
}
