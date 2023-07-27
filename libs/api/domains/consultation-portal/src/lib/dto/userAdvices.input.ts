import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { Field, InputType } from '@nestjs/graphql'

@InputType('ConsultationPortalUserAdvicesInput')
@FeatureFlag(Features.consultationPortalApplication)
export class GetUserAdvicesInput {
  @Field(() => Boolean, { nullable: true })
  oldestFirst?: boolean

  @Field(() => String, { nullable: true })
  searchQuery?: string

  @Field(() => Number, { nullable: true })
  pageNumber?: number

  @Field(() => Number, { nullable: true })
  pageSize?: number
}
