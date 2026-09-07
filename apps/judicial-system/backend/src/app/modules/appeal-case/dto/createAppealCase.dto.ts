import { IsEnum, IsOptional, IsUUID } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { AppealCaseType } from '@island.is/judicial-system/types'

export class CreateAppealCaseDto {
  /**********
   * The id of the ruling order file being appealed. When set, the appeal
   * targets that specific ruling order; when omitted, this is a case-level
   * appeal (the existing flow).
   **********/
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly rulingFileId?: string

  /**********
   * Which decision is being appealed. Omitted means RULING - a kæra - which is
   * every appeal that existed before áfrýjun.
   **********/
  @IsOptional()
  @IsEnum(AppealCaseType)
  @ApiPropertyOptional({ enum: AppealCaseType })
  readonly appealType?: AppealCaseType

  /**********
   * The defendant whose verdict is being appealed. Required for - and only
   * meaningful to - an áfrýjun, which is filed for one specific defendant.
   **********/
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string
}
