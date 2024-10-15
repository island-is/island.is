import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { NotificationType } from '@island.is/judicial-system/types'

export class SubpoenaNotificationDto {
  @IsNotEmpty()
  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type!: NotificationType

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ type: String })
  readonly subpoenaId!: string
}
