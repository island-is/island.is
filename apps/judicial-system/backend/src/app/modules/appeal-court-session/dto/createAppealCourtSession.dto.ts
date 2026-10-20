import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

export class CreateAppealCourtSessionDto {
  @IsEnum(AppealCourtSessionType)
  @ApiProperty({ enum: AppealCourtSessionType })
  readonly sessionType!: AppealCourtSessionType

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ type: Date })
  readonly sessionDate!: Date

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly courtRoom!: string
}
