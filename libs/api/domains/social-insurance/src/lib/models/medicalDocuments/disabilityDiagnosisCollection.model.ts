import { ObjectType, Field } from '@nestjs/graphql'
import { DisabilityDiagnosis } from './disabilityDiagnosis.model'

@ObjectType('SocialInsuranceMedicalDocumentsDisabilityDiagnosisCollection')
export class DisabilityDiagnosisCollection {
  @Field(() => [DisabilityDiagnosis], { nullable: true })
  mainDiagnoses?: Array<DisabilityDiagnosis>

  @Field(() => [DisabilityDiagnosis], { nullable: true })
  otherDiagnoses?: Array<DisabilityDiagnosis>
}
