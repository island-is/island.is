import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ConfirmEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  readonly hash?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly email!: string
}
