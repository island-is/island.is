import { Field, ObjectType } from '@nestjs/graphql'
import { UserCaseSubscriptionResult } from './userCaseSubscriptionResult.model'

@ObjectType('ConsultationPortalUserSubscriptionsAggregate')
export class UserSubscriptionsAggregate {
  @Field(() => Boolean, { nullable: true })
  subscribedToAll?: boolean

  @Field(() => Boolean, { nullable: true })
  subscribedToAllNew?: boolean

  @Field(() => [UserCaseSubscriptionResult], { nullable: true })
  cases?: UserCaseSubscriptionResult[] | null

  @Field(() => [UserCaseSubscriptionResult], { nullable: true })
  institutions?: UserCaseSubscriptionResult[] | null

  @Field(() => [UserCaseSubscriptionResult], { nullable: true })
  policyAreas?: UserCaseSubscriptionResult[] | null
}
