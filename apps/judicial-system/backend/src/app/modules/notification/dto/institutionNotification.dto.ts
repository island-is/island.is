import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { InstitutionNotificationType } from '@island.is/judicial-system/types'

export class InstitutionNotificationDto {
  @IsNotEmpty()
  @IsEnum(InstitutionNotificationType)
  @ApiProperty({ enum: InstitutionNotificationType })
  readonly type!: InstitutionNotificationType

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ type: String })
  readonly prosecutorsOfficeId!: string
}
