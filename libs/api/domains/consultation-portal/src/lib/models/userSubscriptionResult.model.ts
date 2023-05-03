import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalUserSubscriptionResult')
export class UserSubscriptionResult {
  @Field({ nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  subscriptionType?: string | null
}
