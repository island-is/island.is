import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { SubscriptionType } from '@island.is/clients/consultation-portal'

@ObjectType('ConsultationPortalSubscriptionCommand')
@InputType('ConsultationPortalSubscriptionCommandInput')
export class SubscriptionCommand {
  @Field(() => Number, { nullable: true })
  id?: number

  @Field(() => SubscriptionType, { nullable: true })
  subscriptionType?: SubscriptionType
}
