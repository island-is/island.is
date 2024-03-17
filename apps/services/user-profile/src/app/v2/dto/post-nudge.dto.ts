import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { NudgeFrom } from '../../types/nudge-from'

export class PostNudgeDto {
  @IsEnum(NudgeFrom)
  @ApiProperty({ enum: NudgeFrom })
  nudgeFrom: NudgeFrom
}
