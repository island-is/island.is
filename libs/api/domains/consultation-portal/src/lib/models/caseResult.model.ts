import { Field, ObjectType } from '@nestjs/graphql'
import { DocumentInfoResult } from './documentInfoResult.model'
import { CaseStakeholderResult } from './caseStakeholderResult.model'
import { RelatedCaseResult } from './relatedCaseResult.model'

@ObjectType('ConsultationPortalCaseResult')
export class CaseResult {
  @Field(() => Number, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  caseNumber?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  shortDescription?: string | null

  @Field(() => String, { nullable: true })
  detailedDescription?: string | null

  @Field(() => String, { nullable: true })
  contactName?: string | null

  @Field(() => String, { nullable: true })
  contactEmail?: string | null

  @Field(() => String, { nullable: true })
  statusName?: string | null

  @Field(() => String, { nullable: true })
  institutionName?: string | null

  @Field(() => String, { nullable: true })
  typeName?: string | null

  @Field(() => String, { nullable: true })
  policyAreaName?: string | null

  @Field(() => Date, { nullable: true })
  processBegins?: Date

  @Field(() => Date, { nullable: true })
  processEnds?: Date

  @Field(() => String, { nullable: true })
  announcementText?: string | null

  @Field(() => Date, { nullable: true })
  summaryDate?: Date | null

  @Field(() => String, { nullable: true })
  summaryText?: string | null

  @Field(() => String, { nullable: true })
  summaryLink?: string | null

  @Field(() => String, { nullable: true })
  summaryDocumentId?: string | null

  @Field(() => Number, { nullable: true })
  adviceCount?: number

  @Field(() => Number, { nullable: true })
  advicePublishTypeId?: number

  @Field(() => String, { nullable: true })
  advicePublishTypeName?: string | null

  @Field(() => Boolean, { nullable: true })
  allowUsersToSendPrivateAdvices?: boolean

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  changed?: Date

  @Field(() => String, { nullable: true })
  oldInstitutionName?: string | null

  @Field(() => String, { nullable: true })
  extraStakeholderList?: string | null

  @Field(() => [CaseStakeholderResult], { nullable: true })
  stakeholders?: CaseStakeholderResult[] | null

  @Field(() => [DocumentInfoResult], { nullable: true })
  documents?: DocumentInfoResult[] | null

  @Field(() => [DocumentInfoResult], { nullable: true })
  additionalDocuments?: DocumentInfoResult[] | null

  @Field(() => [RelatedCaseResult], { nullable: true })
  relatedCases?: RelatedCaseResult[] | null
}
