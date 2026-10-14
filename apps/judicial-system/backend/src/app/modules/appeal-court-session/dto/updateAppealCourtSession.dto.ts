import { Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

// Each field is validated when it is present, so an explicit null is
// rejected like any other bad value instead of reaching a NOT NULL column.
// IsOptional would let null through.
const whenPresent = (_: unknown, value: unknown) => value !== undefined

export class UpdateAppealCourtSessionDto {
  @ValidateIf(whenPresent)
  @IsEnum(AppealCourtSessionType)
  @ApiPropertyOptional({ enum: AppealCourtSessionType })
  readonly sessionType?: AppealCourtSessionType

  @ValidateIf(whenPresent)
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly sessionDate?: Date

  @ValidateIf(whenPresent)
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  readonly courtRoom?: string
}
