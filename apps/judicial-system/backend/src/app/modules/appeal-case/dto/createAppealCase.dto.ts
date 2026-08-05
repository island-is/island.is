import { IsOptional, IsUUID } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

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
}
