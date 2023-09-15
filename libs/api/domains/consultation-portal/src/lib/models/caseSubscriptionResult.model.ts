import { Field, ObjectType } from '@nestjs/graphql'
import { CaseSubscriptionType } from '@island.is/clients/consultation-portal'

@ObjectType('ConsultationPortalCaseSubscriptionResult')
export class CaseSubscriptionResult {
  @Field(() => CaseSubscriptionType, { nullable: true })
  type?: CaseSubscriptionType
}
