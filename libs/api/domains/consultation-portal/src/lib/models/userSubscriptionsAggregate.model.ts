import { Field, ObjectType } from '@nestjs/graphql'
import { UserSubscriptionResult } from './userSubscriptionResult.model'
import { UserCaseSubscriptionResult } from './userCaseSubscriptionResult.model'

@ObjectType('ConsultationPortalUserSubscriptionsAggregate')
export class UserSubscriptionsAggregate {
  @Field(() => Boolean, { nullable: true })
  subscribedToAll?: boolean

  @Field(() => Boolean, { nullable: true })
  subscribedToAllNew?: boolean

  @Field(() => [UserCaseSubscriptionResult], { nullable: true })
  cases?: Array<UserCaseSubscriptionResult> | null

  @Field(() => [UserSubscriptionResult], { nullable: true })
  institutions?: Array<UserSubscriptionResult> | null

  @Field(() => [UserSubscriptionResult], { nullable: true })
  policyAreas?: Array<UserSubscriptionResult> | null
}
