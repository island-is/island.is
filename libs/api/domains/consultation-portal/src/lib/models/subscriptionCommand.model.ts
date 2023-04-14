import { Field, ObjectType } from '@nestjs/graphql'
import { SubscriptionType } from '@island.is/clients/consultation-portal'

@ObjectType('ConsultationPortalSubscriptionCommand')
export class SubscriptionCommand {
  @Field(() => Number, { nullable: true })
  id?: number

  @Field(() => SubscriptionType, { nullable: true })
  subscriptionType?: SubscriptionType
}
