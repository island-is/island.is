import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type { UserDescriptor } from '@island.is/judicial-system/types'
import {
  CaseIndictmentRulingDecision,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

class ConcludedDecisionDto {
  @IsUUID('4')
  @IsNotEmpty()
  readonly defendantId!: string

  @IsEnum(CaseIndictmentRulingDecision)
  @IsNotEmpty()
  readonly rulingDecision!: CaseIndictmentRulingDecision
}

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
  @ValidateNested({ each: true })
  @Type(() => ConcludedDecisionDto)
  @ApiPropertyOptional({ type: [ConcludedDecisionDto] })
  readonly concludedDecisions?: ConcludedDecisionDto[]
}
