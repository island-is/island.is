import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { NotificationDispatchType } from '@island.is/judicial-system/types'

export class NotificationDispatchnDto {
  @IsNotEmpty()
  @IsEnum(NotificationDispatchType)
  @ApiProperty({ enum: NotificationDispatchType })
  readonly type!: NotificationDispatchType
}
