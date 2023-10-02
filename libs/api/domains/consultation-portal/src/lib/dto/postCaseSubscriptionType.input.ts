import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { Field, InputType, Int } from '@nestjs/graphql'
import { PostCaseSubscriptionCommand } from '../models/postCaseSubscriptionCommand.model'

@InputType('ConsultationPortalPostCaseSubscriptionTypeInput')
@FeatureFlag(Features.consultationPortalApplication)
export class PostCaseSubscriptionTypeInput {
  @Field(() => Int, { nullable: true })
  caseId = 0

  @Field(() => PostCaseSubscriptionCommand, { nullable: true })
  postCaseSubscriptionCommand?: PostCaseSubscriptionCommand
}
