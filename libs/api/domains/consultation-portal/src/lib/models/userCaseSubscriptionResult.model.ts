import { CaseSubscriptionType } from '@island.is/clients/consultation-portal'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(CaseSubscriptionType, {
  name: 'CaseSubscriptionType',
})

@ObjectType('ConsultationPortalUserCaseSubscriptionResult')
export class UserCaseSubscriptionResult {
  @Field({ nullable: true })
  id?: number

  @Field(() => CaseSubscriptionType, { nullable: true })
  subscriptionType?: CaseSubscriptionType
}
