import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import {
  DefendantPlea,
  DefenderChoice,
  Gender,
  IndictmentCaseReviewDecision,
  PunishmentType,
  SubpoenaType,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateDefendantInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly noNationalId?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly name?: string

  @Allow()
  @IsOptional()
  @Field(() => Gender, { nullable: true })
  readonly gender?: Gender

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly address?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly citizenship?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => DefendantPlea, { nullable: true })
  readonly defendantPlea?: DefendantPlea

  @Allow()
  @IsOptional()
  @Field(() => DefenderChoice, { nullable: true })
  readonly defenderChoice?: DefenderChoice

  @Allow()
  @IsOptional()
  @Field(() => SubpoenaType, { nullable: true })
  readonly subpoenaType?: SubpoenaType

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isDefenderChoiceConfirmed?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly caseFilesSharedWithDefender?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isSentToPrisonAdmin?: boolean

  @Allow()
  @IsOptional()
  @Field(() => PunishmentType, { nullable: true })
  readonly punishmentType?: PunishmentType

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isAlternativeService?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly alternativeServiceDescription?: string

  @Allow()
  @IsOptional()
  @Field(() => IndictmentCaseReviewDecision, { nullable: true })
  readonly indictmentReviewDecision?: IndictmentCaseReviewDecision

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isDrivingLicenseSuspended?: boolean
}
