import { CaseSubscriptionType } from '@island.is/clients/consultation-portal'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalCaseSubscriptionCommand')
export class CaseSubscriptionCommand {
  @Field({ nullable: true })
  id?: number

  @Field(() => CaseSubscriptionType, { nullable: true })
  subscriptionType?: CaseSubscriptionType
}
