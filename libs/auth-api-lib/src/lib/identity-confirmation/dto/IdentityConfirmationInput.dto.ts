import { IsEnum, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IdentityConfirmationType } from '../types/identity-confirmation-type'

export class IdentityConfirmationInputDto {
  @IsString()
  @ApiProperty()
  id!: string

  @IsEnum(IdentityConfirmationType)
  @ApiProperty()
  type!: IdentityConfirmationType
}
