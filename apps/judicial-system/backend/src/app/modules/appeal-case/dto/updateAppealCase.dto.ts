import { Type } from 'class-transformer'
import {
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
  UserRole,
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
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  readonly appealJudgeIds?: string[]

  // One position on the bench each, for clients that have not moved to
  // appealJudgeIds: a slot replaces the judge at that position and leaves the
  // rest of the bench as it is. Ignored when appealJudgeIds is present.
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealJudge1Id?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealJudge2Id?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealJudge3Id?: string

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
}
