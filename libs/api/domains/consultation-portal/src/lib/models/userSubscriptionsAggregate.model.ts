import { Field, ObjectType } from '@nestjs/graphql'
import { UserSubscriptionResult } from './userSubscriptionResult.model'
import { UserCaseSubscriptionResult } from './userCaseSubscriptionResult.model'
import { SubscriptionType } from '@island.is/clients/consultation-portal'

@ObjectType('ConsultationPortalUserSubscriptionsAggregate')
export class UserSubscriptionsAggregate {
  @Field(() => Boolean, { nullable: true })
  subscribedToAll?: boolean

  @Field(() => SubscriptionType, { nullable: true })
  subscribedToAllType?: SubscriptionType

  @Field(() => [UserCaseSubscriptionResult], { nullable: true })
  cases?: Array<UserCaseSubscriptionResult> | null

  @Field(() => [UserSubscriptionResult], { nullable: true })
  institutions?: Array<UserSubscriptionResult> | null

  @Field(() => [UserSubscriptionResult], { nullable: true })
  policyAreas?: Array<UserSubscriptionResult> | null
}
