import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum VmstApplicationStatusColor {
  mint = 'mint',
  purple = 'purple',
  red = 'red',
  warn = 'warn',
}

registerEnumType(VmstApplicationStatusColor, {
  name: 'VmstApplicationStatusColor',
})

@ObjectType('VmstOverviewItem')
export class VmstOverviewItem {
  @Field({ nullable: true })
  key?: string

  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string
}

@ObjectType('VmstAvailableActions')
export class VmstAvailableActions {
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

  @Field(() => VmstApplicationStatusColor, { nullable: true })
  applicationStatusColor?: VmstApplicationStatusColor

  @Field({ nullable: true })
  dataRequested?: boolean

  @Field(() => VmstAvailableActions, { nullable: true })
  availableActions?: VmstAvailableActions

  @Field(() => [VmstOverviewItem], { nullable: true })
  overviewItems?: VmstOverviewItem[]
}
