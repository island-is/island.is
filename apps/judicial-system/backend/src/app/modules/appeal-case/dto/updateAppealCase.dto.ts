import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  CaseAppealRulingDecision,
  UserRole,
} from '@island.is/judicial-system/types'

export class UpdateAppealCaseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealCaseNumber?: string

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  readonly prosecutorStatementDate?: Date

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  readonly defendantStatementDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealAssistantId?: string

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
  @IsEnum(CaseAppealRulingDecision)
  @ApiPropertyOptional({ enum: CaseAppealRulingDecision })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  readonly appealValidToDate?: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isAppealCustodyIsolation?: boolean

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  readonly appealIsolationToDate?: Date

  @IsOptional()
  @IsEnum(UserRole, { each: true })
  @ApiPropertyOptional({ enum: UserRole, isArray: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]
}
