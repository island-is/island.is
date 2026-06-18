import { IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { UserDescriptor } from '@island.is/judicial-system/types'
import {
  CaseIndictmentRulingDecision,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

export class IndictmentCaseNotificationDto {
  @IsNotEmpty()
  @IsEnum(IndictmentCaseNotificationType)
  @ApiProperty({ enum: IndictmentCaseNotificationType })
  readonly type!: IndictmentCaseNotificationType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly userDescriptor?: UserDescriptor

  @IsOptional()
  @IsArray()
  @IsEnum(CaseIndictmentRulingDecision, { each: true })
  @ApiPropertyOptional({ enum: CaseIndictmentRulingDecision, isArray: true })
  readonly concludedDecisions?: CaseIndictmentRulingDecision[]
}
