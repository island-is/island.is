import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  InformationForDefendant,
  ServiceRequirement,
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

registerEnumType(ServiceRequirement, { name: 'ServiceRequirement' })
registerEnumType(VerdictAppealDecision, { name: 'VerdictAppealDecision' })
registerEnumType(InformationForDefendant, { name: 'InformationForDefendant' })
registerEnumType(VerdictServiceStatus, { name: 'VerdictServiceStatus' })

@ObjectType()
export class Verdict {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  created?: string

  @Field(() => String, { nullable: true })
  modified?: string

  @Field(() => String, { nullable: true })
  verdictDeliveredToNationalCommissionersOffice?: string

  @Field(() => String, { nullable: true })
  defendantId?: string

  @Field(() => String, { nullable: true })
  caseId?: string

  @Field(() => ServiceRequirement, { nullable: true })
  serviceRequirement?: ServiceRequirement

  @Field(() => VerdictServiceStatus, { nullable: true })
  serviceStatus?: VerdictServiceStatus

  @Field(() => String, { nullable: true })
  serviceDate?: string

  @Field(() => String, { nullable: true })
  servedBy?: string

  @Field(() => VerdictAppealDecision, { nullable: true })
  appealDecision?: VerdictAppealDecision

  @Field(() => String, { nullable: true })
  appealDate?: string

  @Field(() => [InformationForDefendant], { nullable: true })
  serviceInformationForDefendant?: InformationForDefendant[]

  @Field(() => String, { nullable: true })
  externalPoliceDocumentId?: string

  @Field(() => String, { nullable: true })
  legalPaperRequestDate?: string

  @Field(() => String, { nullable: true })
  comment?: string

  @Field(() => String, { nullable: true })
  deliveredToDefenderNationalId?: string
}
