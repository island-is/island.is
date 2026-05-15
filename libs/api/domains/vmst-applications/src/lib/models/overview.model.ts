import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { VmstApplicationStatus } from '@island.is/clients/vmst-unemployment'

export { VmstApplicationStatus }

registerEnumType(VmstApplicationStatus, {
  name: 'VmstApplicationStatus',
})

@ObjectType('VmstApplicationOverviewItem')
export class VmstApplicationOverviewItem {
  @Field({ nullable: true })
  key?: string

  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string
}

@ObjectType('VmstApplicationsAvailableActions')
export class VmstApplicationsAvailableActions {
  @Field({ nullable: true })
  canContact?: boolean

  @Field({ nullable: true })
  canSubmitDocuments?: boolean

  @Field({ nullable: true })
  canReportWork?: boolean

  @Field({ nullable: true })
  canReportTravel?: boolean

  @Field({ nullable: true })
  canUnregister?: boolean

  @Field({ nullable: true })
  canConfirmJobSearch?: boolean
}

@ObjectType('VmstApplicationsUnemploymentApplicationOverview')
export class VmstApplicationsUnemploymentApplicationOverview {
  @Field({ nullable: true })
  applicantId?: string

  @Field(() => String, { nullable: true })
  unemploymentApplicationId?: string | null

  @Field(() => String, { nullable: true })
  applicationStatusId?: string | null

  @Field(() => String, { nullable: true })
  applicationStatusName?: string | null

  @Field(() => VmstApplicationStatus, { nullable: true })
  applicationStatus?: VmstApplicationStatus

  @Field({ nullable: true })
  dataRequested?: boolean

  @Field(() => VmstApplicationsAvailableActions, { nullable: true })
  availableActions?: VmstApplicationsAvailableActions

  @Field(() => [VmstApplicationOverviewItem], { nullable: true })
  overviewItems?: VmstApplicationOverviewItem[]
}
