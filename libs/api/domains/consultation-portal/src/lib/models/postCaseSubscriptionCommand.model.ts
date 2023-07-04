import { CaseSubscriptionType } from '@island.is/clients/consultation-portal'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalPostCaseSubscriptionCommand')
@InputType('ConsultationPortalPostCaseSubscriptionCommandInput')
export class PostCaseSubscriptionCommand {
  @Field(() => CaseSubscriptionType, { nullable: true })
  subscriptionType?: CaseSubscriptionType
}
