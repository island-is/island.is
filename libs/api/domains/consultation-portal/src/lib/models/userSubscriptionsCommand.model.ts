import { Field, ObjectType } from '@nestjs/graphql'
import { CaseSubscriptionCommand } from './caseSubscriptionCommand.model'
import { SubscriptionCommand } from './subscriptionCommand.model'

@ObjectType('ConsultationPortalUserSubscriptionsCommand')
export class UserSubscriptionsCommand {
  @Field({ nullable: true })
  subscribeToAll?: boolean

  @Field({ nullable: true })
  subscribeToAllType?: string | null

  @Field(() => [CaseSubscriptionCommand], { nullable: true })
  caseIds?: CaseSubscriptionCommand[] | null

  @Field(() => [SubscriptionCommand], { nullable: true })
  institutionIds?: SubscriptionCommand[] | null

  @Field(() => [SubscriptionCommand], { nullable: true })
  policyAreaIds?: SubscriptionCommand[] | null
}
