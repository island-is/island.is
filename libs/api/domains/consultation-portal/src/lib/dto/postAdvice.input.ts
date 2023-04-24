import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { Field, InputType, Int } from '@nestjs/graphql'
import { CaseAdviceCommand } from '../models/caseAdviceCommand.model'

@InputType('ConsultationPortalPostAdviceInput')
@FeatureFlag(Features.consultationPortalApplication)
export class PostAdviceInput {
  @Field(() => Int, { nullable: true })
  caseId = 0

  @Field(() => CaseAdviceCommand, { nullable: true })
  caseAdviceCommand?: CaseAdviceCommand
}
