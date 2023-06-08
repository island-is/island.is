import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { Field, InputType, Int } from '@nestjs/graphql'
import { PostCaseAdviceCommand } from '../models/postCaseAdviceCommand.model'

@InputType('ConsultationPortalPostAdviceInput')
@FeatureFlag(Features.consultationPortalApplication)
export class PostAdviceInput {
  @Field(() => Int, { nullable: true })
  caseId = 0

  @Field(() => PostCaseAdviceCommand, { nullable: true })
  postCaseAdviceCommand?: PostCaseAdviceCommand
}
