import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  AppealCaseRulingDecision,
  AppealRulingType,
  MAX_APPEAL_JUDGE_COUNT,
  UserRole,
  VerdictAppealStatus,
} from '@island.is/judicial-system/types'

export class UpdateAppealCaseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealCaseNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealAssistantId?: string

  // The whole bench, in order: when present it replaces the judges of the
  // appeal case, the first id is the presiding judge and an empty list clears
  // the bench.
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(MAX_APPEAL_JUDGE_COUNT)
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  readonly appealJudgeIds?: string[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealConclusion?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealRulingModifiedHistory?: string

  @IsOptional()
  @IsEnum(AppealCaseRulingDecision)
  @ApiPropertyOptional({ enum: AppealCaseRulingDecision })
  readonly appealRulingDecision?: AppealCaseRulingDecision

  @IsOptional()
  @IsEnum(AppealRulingType)
  @ApiPropertyOptional({ enum: AppealRulingType })
  readonly appealRulingType?: AppealRulingType

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly appealValidToDate?: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isAppealCustodyIsolation?: boolean

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly appealIsolationToDate?: Date

  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @ApiPropertyOptional({ enum: UserRole, isArray: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]

  // Only a verdict appeal has one; the service rejects it on a ruling appeal.
  @IsOptional()
  @IsEnum(VerdictAppealStatus)
  @ApiPropertyOptional({ enum: VerdictAppealStatus })
  readonly verdictAppealStatus?: VerdictAppealStatus
}
