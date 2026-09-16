import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'

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
   * Which decision is being appealed. Omitted means ruling appeal which is
   * every appeal that existed before verdict appeals.
   **********/
  @IsOptional()
  @IsEnum(AppealCaseType)
  @ApiPropertyOptional({ enum: AppealCaseType })
  readonly appealType?: AppealCaseType

  /**********
   * The defendant whose verdict is being appealed. Required for - and only
   * meaningful to - a verdict appeal, which is filed for one specific defendant.
   **********/
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string

  /**********
   * When the verdict appeal was filed. Only honoured when the public
   * prosecution office registers an appeal that reached it outside the system,
   * by letter or email - the date is then the one on that filing. A defender
   * appealing in the system appeals now, and the field is ignored.
   **********/
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly appealDate?: Date

  /**********
   * The defender who filed the verdict appeal, when the public prosecution
   * office registers it - typically a new defender with rights before the court
   * of appeals, who is not the defender of record. Recorded on the defendant as
   * information only; no access follows until the court of appeals confirms them.
   **********/
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealDefenderName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealDefenderNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealDefenderEmail?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealDefenderPhoneNumber?: string
}
