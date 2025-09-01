import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { EstimatedDuration } from './estimatedDuration.model'
import { EnumType } from './enumType.model'

@ObjectType('SocialInsuranceMedicalDocumentsCaseManager')
class CaseManager {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  jobTitle?: string

  @Field({ nullable: true })
  workplace?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsPreviousTreatment')
class PreviousTreatment {
  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  application?: string

  @Field(() => EnumType, { nullable: true })
  type?: EnumType

  @Field({ nullable: true })
  other?: string

  @Field({ nullable: true })
  content?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsTreatmentPlan')
class TreatmentPlan {
  @Field({ nullable: true })
  applicationType?: string

  @Field(() => [EnumType], { nullable: true })
  treatmentType?: Array<EnumType>

  @Field({ nullable: true })
  explanation?: string

  @Field({ nullable: true })
  discharge?: string

  @Field({ nullable: true })
  plannedFollowup?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsConfirmedTreatment')
export class ConfirmedTreatment {
  @Field({ nullable: true })
  referenceId?: string

  @Field(() => CaseManager, { nullable: true })
  caseManager?: CaseManager

  @Field(() => GraphQLISODateTime, { nullable: true })
  confirmationDate?: Date

  @Field(() => PreviousTreatment, { nullable: true })
  previousTreatment?: PreviousTreatment

  @Field(() => TreatmentPlan, { nullable: true })
  treatmentPlan?: TreatmentPlan

  @Field(() => [EnumType], { nullable: true })
  treatmentType?: Array<EnumType>

  @Field(() => EstimatedDuration, { nullable: true })
  estimatedDuration?: EstimatedDuration
}
