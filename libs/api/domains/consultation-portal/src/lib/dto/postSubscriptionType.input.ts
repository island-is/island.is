import { SubscriptionType } from '@island.is/clients/consultation-portal'
import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { Field, InputType } from '@nestjs/graphql'
import { CaseSubscriptionCommand } from '../models/caseSubscriptionCommand.model'
import { SubscriptionCommand } from '../models/subscriptionCommand.model'

@InputType('ConsultationPortalUserSubscriptionsCommandInput')
@FeatureFlag(Features.consultationPortalApplication)
export class PostSubscriptionTypeInput {
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
