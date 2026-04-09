import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstOverviewItem')
export class VmstOverviewItem {
  @Field(() => String, { nullable: true })
  key?: string

  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  value?: string
}

@ObjectType('VmstAvailableActions')
export class VmstAvailableActions {
  @Field(() => Boolean, { nullable: true })
  canContact?: boolean

  @Field(() => Boolean, { nullable: true })
  canSubmitDocuments?: boolean

  @Field(() => Boolean, { nullable: true })
  canReportWork?: boolean

  @Field(() => Boolean, { nullable: true })
  canReportTravel?: boolean

  @Field(() => Boolean, { nullable: true })
  canUnregister?: boolean

  @Field(() => Boolean, { nullable: true })
  canConfirmJobSearch?: boolean
}

@ObjectType('UnemploymentApplicationOverview')
export class UnemploymentApplicationOverview {
  @Field(() => String, { nullable: true })
  applicantId?: string

  @Field(() => String, { nullable: true })
  unemploymentApplicationId?: string | null

  @Field(() => String, { nullable: true })
  applicationStatusId?: string | null

  @Field(() => String, { nullable: true })
  applicationStatusName?: string | null

  @Field(() => Boolean, { nullable: true })
  dataRequested?: boolean

  @Field(() => VmstAvailableActions, { nullable: true })
  availableActions?: VmstAvailableActions

  @Field(() => [VmstOverviewItem], { nullable: true })
  overviewItems?: VmstOverviewItem[]
}
