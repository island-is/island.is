import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  DefendantPlea,
  DefenderChoice,
  Gender,
  IndictmentCaseReviewDecision,
  PunishmentType,
  SubpoenaType,
} from '@island.is/judicial-system/types'

import { Subpoena } from '../../subpoena'
import { Verdict } from '../../verdict'

registerEnumType(Gender, { name: 'Gender' })
registerEnumType(DefendantPlea, { name: 'DefendantPlea' })
registerEnumType(DefenderChoice, { name: 'DefenderChoice' })
registerEnumType(SubpoenaType, { name: 'SubpoenaType' })
registerEnumType(PunishmentType, { name: 'PunishmentType' })
registerEnumType(IndictmentCaseReviewDecision, {
  name: 'IndictmentCaseReviewDecision',
})

@ObjectType()
export class Defendant {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => Boolean, { nullable: true })
  readonly noNationalId?: boolean

  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => String, { nullable: true })
  readonly name?: string

  @Field(() => Gender, { nullable: true })
  readonly gender?: Gender

  @Field(() => String, { nullable: true })
  readonly address?: string

  @Field(() => String, { nullable: true })
  readonly citizenship?: string

  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Field(() => String, { nullable: true })
  readonly defenderNationalId?: string

  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Field(() => DefendantPlea, { nullable: true })
  readonly defendantPlea?: DefendantPlea

  // represents appeal deadline for both verdicts and fines
  @Field(() => String, { nullable: true })
  readonly verdictAppealDeadline?: string

  // represents appeal deadline for both verdicts and fines
  @Field(() => Boolean, { nullable: true })
  readonly isVerdictAppealDeadlineExpired?: boolean

  @Field(() => DefenderChoice, { nullable: true })
  readonly defenderChoice?: DefenderChoice

  @Field(() => DefenderChoice, { nullable: true })
  readonly requestedDefenderChoice?: DefenderChoice

  @Field(() => String, { nullable: true })
  readonly requestedDefenderNationalId?: string

  @Field(() => String, { nullable: true })
  readonly requestedDefenderName?: string

  @Field(() => SubpoenaType, { nullable: true })
  readonly subpoenaType?: SubpoenaType

  @Field(() => [Subpoena], { nullable: true })
  readonly subpoenas?: Subpoena[]

  @Field(() => Verdict, { nullable: true })
  readonly verdict?: Verdict

  @Field(() => Boolean, { nullable: true })
  readonly isDefenderChoiceConfirmed?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly caseFilesSharedWithDefender?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly isSentToPrisonAdmin?: boolean

  @Field(() => String, { nullable: true })
  readonly sentToPrisonAdminDate?: string

  @Field(() => String, { nullable: true })
  readonly openedByPrisonAdminDate?: string

  @Field(() => PunishmentType, { nullable: true })
  readonly punishmentType?: PunishmentType

  @Field(() => Boolean, { nullable: true })
  readonly isAlternativeService?: boolean

  @Field(() => String, { nullable: true })
  readonly alternativeServiceDescription?: string

  @Field(() => IndictmentCaseReviewDecision, { nullable: true })
  readonly indictmentReviewDecision?: IndictmentCaseReviewDecision

  @Field(() => Boolean, { nullable: true })
  readonly isDrivingLicenseSuspended?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly publicProsecutorIsRegisteredInPoliceSystem?: boolean
}
