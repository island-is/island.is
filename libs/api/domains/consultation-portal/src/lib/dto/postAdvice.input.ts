import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { Field, InputType, Int } from '@nestjs/graphql'
import { AdviceRequest } from '../models/adviceRequest.model'

@InputType('ConsultationPortalPostAdviceInput')
@FeatureFlag(Features.consultationPortalApplication)
export class PostAdviceInput {
  @Field(() => Int, { nullable: true })
  caseId = 0

  @Field(() => AdviceRequest, { nullable: true })
  adviceRequest?: AdviceRequest
}
