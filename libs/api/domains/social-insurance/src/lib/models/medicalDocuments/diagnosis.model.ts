import { ObjectType, Field } from '@nestjs/graphql'
import { IcdCode } from './icdCode.model'

@ObjectType('SocialInsuranceMedicalDocumentsDiagnosis')
export class Diagnosis {
  @Field(() => [IcdCode], { nullable: true })
  icd?: Array<IcdCode>

  @Field(() => [IcdCode], { nullable: true })
  others?: Array<IcdCode>
}
