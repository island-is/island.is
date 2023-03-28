import { Field, ObjectType } from '@nestjs/graphql'
import { CaseSubscriptionCommand } from './caseSubscriptionCommand.model'

@ObjectType('ConsultationPortalUserSubscriptionsCommand')
export class UserSubscriptionsCommand {
  @Field({ nullable: true })
  subscribeToAll?: boolean

  @Field(() => [CaseSubscriptionCommand], { nullable: true })
  caseIds?: CaseSubscriptionCommand[] | null

  @Field(() => [CaseSubscriptionCommand], { nullable: true })
  institutionIds?: CaseSubscriptionCommand[] | null

  @Field(() => [CaseSubscriptionCommand], { nullable: true })
  policyAreaIds?: CaseSubscriptionCommand[] | null
}
