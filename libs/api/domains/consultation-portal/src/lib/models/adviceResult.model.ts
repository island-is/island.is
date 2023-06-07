import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'
import { DocumentInfoResult } from './documentInfoResult.model'
import {
  CaseSubscriptionType,
  SubscriptionType,
} from '@island.is/clients/consultation-portal'

registerEnumType(CaseSubscriptionType, {
  name: 'CaseSubscriptionType',
})

registerEnumType(SubscriptionType, {
  name: 'SubscriptionType',
})

@ObjectType('ConsultationPortalAdviceResult')
export class AdviceResult {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  number?: number

  @Field(() => String, { nullable: true })
  participantName?: string | null

  @Field(() => String, { nullable: true })
  participantEmail?: string | null

  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => Boolean, { nullable: true })
  isPrivate?: boolean

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => [DocumentInfoResult], { nullable: true })
  adviceDocuments?: DocumentInfoResult[] | null
}
