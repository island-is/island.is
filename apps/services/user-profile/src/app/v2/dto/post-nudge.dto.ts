import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { NudgeType } from '../../types/nudge-type'

export class PostNudgeDto {
  @IsEnum(NudgeType)
  @ApiProperty({ enum: NudgeType })
  nudgeType!: NudgeType
}
