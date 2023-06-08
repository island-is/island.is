import { Field, ObjectType } from '@nestjs/graphql'
import { CaseSubscriptionCommand } from './caseSubscriptionCommand.model'
import { SubscriptionCommand } from './subscriptionCommand.model'
import { SubscriptionType } from '@island.is/clients/consultation-portal'

@ObjectType('ConsultationPortalPostUserSubscriptionsCommand')
export class PostUserSubscriptionsCommand {
  @Field({ nullable: true })
  subscribeToAll?: boolean

  @Field(() => SubscriptionType, { nullable: true })
  subscribeToAllType?: SubscriptionType

  @Field(() => [CaseSubscriptionCommand], { nullable: true })
  caseIds?: CaseSubscriptionCommand[] | null

  @Field(() => [SubscriptionCommand], { nullable: true })
  institutionIds?: SubscriptionCommand[] | null

  @Field(() => [SubscriptionCommand], { nullable: true })
  policyAreaIds?: SubscriptionCommand[] | null
}
