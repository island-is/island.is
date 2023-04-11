import { SubscriptionType } from '@island.is/clients/consultation-portal'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(SubscriptionType, {
  name: 'SubscriptionType',
})

@ObjectType('ConsultationPortalUserSubscriptionResult')
export class UserSubscriptionResult {
  @Field({ nullable: true })
  id?: number

  @Field(() => SubscriptionType, { nullable: true })
  subscriptionType?: SubscriptionType
}
