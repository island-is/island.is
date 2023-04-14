import { CaseSubscriptionType } from '@island.is/clients/consultation-portal'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalPostCaseSubscriptionCommand')
export class PostCaseSubscriptionCommand {
  @Field(() => CaseSubscriptionType, { nullable: true })
  subscriptionType?: CaseSubscriptionType
}
