import { Field, ObjectType } from '@nestjs/graphql'
import { CaseSubscriptionResult } from './caseSubscriptionResult.model'

@ObjectType('ConsultationPortalUserSubscriptionsResult')
export class UserSubscriptionsResult {
  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => Boolean, { nullable: true })
  emailVerified?: boolean | null

  @Field({ nullable: true })
  subscribedToAll?: boolean

  @Field({ nullable: true })
  subscribedToAllNew?: boolean

  @Field(() => [CaseSubscriptionResult], { nullable: true })
  cases?: CaseSubscriptionResult[] | null

  @Field(() => [CaseSubscriptionResult], { nullable: true })
  institutions?: CaseSubscriptionResult[] | null

  @Field(() => [CaseSubscriptionResult], { nullable: true })
  policyAreas?: CaseSubscriptionResult[] | null
}
