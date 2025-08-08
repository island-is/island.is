import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  InformationForDefendant,
  ServiceRequirement,
  ServiceStatus,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

registerEnumType(ServiceRequirement, { name: 'ServiceRequirement' })
registerEnumType(VerdictAppealDecision, { name: 'VerdictAppealDecision' })
registerEnumType(InformationForDefendant, { name: 'InformationForDefendant' })

@ObjectType()
export class Verdict {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  created?: string

  @Field(() => String, { nullable: true })
  modified?: string

  @Field(() => String, { nullable: true })
  defendantId?: string

  @Field(() => String, { nullable: true })
  caseId?: string

  @Field(() => ServiceRequirement, { nullable: true })
  serviceRequirement?: ServiceRequirement

  @Field(() => ServiceStatus, { nullable: true })
  serviceStatus?: ServiceStatus

  @Field(() => Date, { nullable: true })
  serviceDate?: Date

  @Field(() => String, { nullable: true })
  servedBy?: string

  @Field(() => VerdictAppealDecision, { nullable: true })
  appealDecision?: VerdictAppealDecision

  @Field(() => Date, { nullable: true })
  appealDate?: Date

  @Field(() => InformationForDefendant, { nullable: true })
  serviceInformationForDefendant?: InformationForDefendant
}
