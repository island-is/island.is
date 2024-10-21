import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { NotificationType } from '@island.is/judicial-system/types'

import { Subpoena } from '../../subpoena'

export class SubpoenaNotificationDto {
  @IsNotEmpty()
  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type!: NotificationType

  @IsNotEmpty()
  @ApiProperty({ type: Subpoena })
  readonly subpoena!: Subpoena
}
