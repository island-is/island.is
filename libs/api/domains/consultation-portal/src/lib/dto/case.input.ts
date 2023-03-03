import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { InputType, Field, Float } from '@nestjs/graphql'

@InputType('ConsultationPortalCaseInput')
@FeatureFlag(Features.consultationPortalApplication)
export class GetCaseInput {
  @Field(() => Float)
  caseId: number = 0
}
