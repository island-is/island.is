import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ConfirmSmsDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  readonly code?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly mobilePhoneNumber!: string
}
