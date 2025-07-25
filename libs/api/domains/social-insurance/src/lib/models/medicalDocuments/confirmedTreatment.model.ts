import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { EstimatedDuration } from './estimatedDuration.model'

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

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  other?: string

  @Field({ nullable: true })
  content?: string
}

@ObjectType('SocialInsuranceMedicalDocumentsTreatmentPlan')
class TreatmentPlan {
  @Field({ nullable: true })
  applicationType?: string

  @Field({ nullable: true })
  treatmentType?: string

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
  confimationDate?: Date

  @Field(() => PreviousTreatment, { nullable: true })
  previousTreatment?: PreviousTreatment

  @Field(() => TreatmentPlan, { nullable: true })
  treatmentPlan?: TreatmentPlan

  @Field(() => [String], { nullable: true })
  treatmentType?: Array<string>

  @Field(() => EstimatedDuration, { nullable: true })
  estimatedDuration?: EstimatedDuration
}
