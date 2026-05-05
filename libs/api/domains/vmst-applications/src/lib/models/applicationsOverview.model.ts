import { Field, ObjectType } from '@nestjs/graphql'
import { VmstApplicationStatusColor } from './overview.model'

@ObjectType('VmstApplicationOverviewItem')
export class VmstApplicationOverviewItem {
  @Field(() => String, { nullable: true })
  applicationId?: string | null

  @Field(() => String, { nullable: true })
  statusId?: string | null

  @Field(() => String, { nullable: true })
  statusName?: string | null

  @Field(() => VmstApplicationStatusColor, { nullable: true })
  statusColor?: VmstApplicationStatusColor

  @Field({ nullable: true })
  isVisible?: boolean
}

@ObjectType('VmstApplicationsOverview')
export class VmstApplicationsOverview {
  @Field(() => VmstApplicationOverviewItem, { nullable: true })
  unemploymentApplication?: VmstApplicationOverviewItem

  @Field(() => VmstApplicationOverviewItem, { nullable: true })
  activationGrant?: VmstApplicationOverviewItem
}
