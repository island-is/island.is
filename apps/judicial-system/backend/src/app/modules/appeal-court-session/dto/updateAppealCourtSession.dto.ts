import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

export class UpdateAppealCourtSessionDto {
  @IsOptional()
  @IsEnum(AppealCourtSessionType)
  @ApiPropertyOptional({ enum: AppealCourtSessionType })
  readonly sessionType?: AppealCourtSessionType

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly sessionDate?: Date

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  readonly courtRoom?: string
}
