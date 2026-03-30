import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstOverviewRow')
export class VmstOverviewRow {
  @Field(() => String, { nullable: true })
  key?: string

  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  value?: string
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

  @Field(() => [VmstOverviewRow], { nullable: true })
  rows?: VmstOverviewRow[]
}
