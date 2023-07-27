import { Field, ObjectType } from '@nestjs/graphql'
import { DocumentInfoResult } from './documentInfoResult.model'
import { UserAdviceCaseResult } from './userAdviceCaseResult.model'

@ObjectType('ConsultationPortalUserAdviceResult')
export class UserAdviceResult {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  caseId?: number

  @Field(() => String, { nullable: true })
  participantName?: string | null

  @Field(() => String, { nullable: true })
  participantEmail?: string | null

  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field({ nullable: true })
  _case?: UserAdviceCaseResult

  @Field(() => [DocumentInfoResult], { nullable: true })
  adviceDocuments?: DocumentInfoResult[] | null
}
