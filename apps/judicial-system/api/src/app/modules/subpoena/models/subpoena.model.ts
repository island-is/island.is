import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { ServiceStatus } from '@island.is/judicial-system/types'

registerEnumType(ServiceStatus, { name: 'ServiceStatus' })

@ObjectType()
export class Subpoena {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  created?: string

  @Field(() => String, { nullable: true })
  modified?: string

  @Field(() => String, { nullable: true })
  policeSubpoenaId?: string

  @Field(() => String, { nullable: true })
  defendantId?: string

  @Field(() => String, { nullable: true })
  caseId?: string

  @Field(() => ServiceStatus, { nullable: true })
  serviceStatus?: ServiceStatus

  @Field(() => String, { nullable: true })
  serviceDate?: string

  @Field(() => String, { nullable: true })
  servedBy?: string

  @Field(() => String, { nullable: true })
  comment?: string

  @Field(() => String, { nullable: true })
  defenderNationalId?: string

  @Field(() => String, { nullable: true })
  arraignmentDate?: string

  @Field(() => String, { nullable: true })
  location?: string
}
