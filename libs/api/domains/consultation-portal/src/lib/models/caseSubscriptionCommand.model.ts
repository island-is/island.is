import { CaseSubscriptionType } from '@island.is/clients/consultation-portal'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalCaseSubscriptionCommand')
@InputType('ConsultationPortalCaseSubscriptionCommandInput')
export class CaseSubscriptionCommand {
  @Field({ nullable: true })
  id?: number

  @Field(() => CaseSubscriptionType, { nullable: true })
  subscriptionType?: CaseSubscriptionType
}
