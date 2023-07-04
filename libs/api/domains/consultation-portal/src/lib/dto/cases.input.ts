import { CasesOrderBy } from '@island.is/clients/consultation-portal'
import { FeatureFlag, Features } from '@island.is/nest/feature-flags'
import { Field, InputType } from '@nestjs/graphql'

@InputType('ConsultationPortalCasesInput')
@FeatureFlag(Features.consultationPortalApplication)
export class GetCasesInput {
  @Field(() => String, { nullable: true })
  searchQuery?: string

  @Field(() => [Number], { nullable: true })
  policyAreas?: Array<number>

  @Field(() => [Number], { nullable: true })
  institutions?: Array<number>

  @Field(() => [Number], { nullable: true })
  caseStatuses?: Array<number>

  @Field(() => [Number], { nullable: true })
  caseTypes?: Array<number>

  @Field(() => Date, { nullable: true })
  dateFrom?: Date

  @Field(() => Date, { nullable: true })
  dateTo?: Date

  @Field(() => String, { nullable: true })
  orderBy?: CasesOrderBy

  @Field(() => Number, { nullable: true })
  pageNumber?: number

  @Field(() => Number, { nullable: true })
  pageSize?: number
}
