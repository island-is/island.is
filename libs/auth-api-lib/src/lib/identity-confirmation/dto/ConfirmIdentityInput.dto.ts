import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ConfirmIdentityInputDto {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  nationalId!: string
}
