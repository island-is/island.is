import { SubscriptionType } from '@island.is/clients/consultation-portal'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalUserCaseSubscriptionResult')
export class UserCaseSubscriptionResult {
  @Field({ nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  subscriptionType?: string | null
}
