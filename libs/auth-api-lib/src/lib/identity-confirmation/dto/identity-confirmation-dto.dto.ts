import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsString } from 'class-validator'

import { IdentityConfirmationType } from '../types/identity-confirmation-type'

export class IdentityConfirmationDTO {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsEnum(IdentityConfirmationType)
  type!: IdentityConfirmationType

  @ApiProperty()
  @IsString()
  ticketId!: string

  @ApiProperty()
  @IsString()
  title?: string | null

  @ApiProperty()
  @IsString()
  description?: string | null

  @ApiProperty()
  @IsBoolean()
  isExpired!: boolean
}
