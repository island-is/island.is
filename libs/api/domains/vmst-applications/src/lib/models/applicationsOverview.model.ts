import { Field, ObjectType } from '@nestjs/graphql'
import { VmstApplicationStatus } from './overview.model'

@ObjectType('VmstApplicationsOverviewItem')
export class VmstApplicationsOverviewItem {
  @Field(() => String, { nullable: true })
  applicationId?: string | null

  @Field(() => String, { nullable: true })
  statusId?: string | null

  @Field(() => String, { nullable: true })
  statusName?: string | null

  @Field(() => VmstApplicationStatus, { nullable: true })
  status?: VmstApplicationStatus

  @Field({ nullable: true })
  isVisible?: boolean
}

@ObjectType('VmstApplicationsOverview')
export class VmstApplicationsOverview {
  @Field(() => VmstApplicationsOverviewItem, { nullable: true })
  unemploymentApplication?: VmstApplicationsOverviewItem

  @Field(() => VmstApplicationsOverviewItem, { nullable: true })
  activationGrant?: VmstApplicationsOverviewItem
}
