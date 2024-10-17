import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { SubpoenaNotificationType } from '@island.is/judicial-system/types'

import { Subpoena } from '../../subpoena'

export class SubpoenaNotificationDto {
  @IsNotEmpty()
  @IsEnum(SubpoenaNotificationType)
  @ApiProperty({ enum: SubpoenaNotificationType })
  readonly type!: SubpoenaNotificationType

  @IsNotEmpty()
  @ApiProperty({ type: Subpoena })
  readonly subpoena!: Subpoena
}
