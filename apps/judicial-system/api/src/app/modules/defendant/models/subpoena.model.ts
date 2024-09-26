import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { ServiceStatus } from '@island.is/judicial-system/types'

registerEnumType(ServiceStatus, { name: 'ServiceStatus' })

@ObjectType()
export class Subpoena {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly subpoenaId?: string

  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => ServiceStatus, { nullable: true })
  readonly serviceStatus?: ServiceStatus

  @Field(() => String, { nullable: true })
  readonly serviceDate?: string

  @Field(() => String, { nullable: true })
  readonly servedBy?: string

  @Field(() => String, { nullable: true })
  readonly comment?: string

  @Field(() => String, { nullable: true })
  readonly defenderNationalId?: string
}
