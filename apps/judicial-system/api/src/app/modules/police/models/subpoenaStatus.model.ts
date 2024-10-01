import { Field, ObjectType } from '@nestjs/graphql'

import { ServiceStatus } from '@island.is/judicial-system/types'

@ObjectType()
export class SubpoenaStatus {
  @Field(() => ServiceStatus)
  readonly serviceStatus!: ServiceStatus

  @Field(() => String, { nullable: true })
  readonly servedBy?: string

  @Field(() => String, { nullable: true })
  readonly comment?: string

  @Field(() => String, { nullable: true })
  readonly serviceDate?: string
}
