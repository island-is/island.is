import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmSmsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly code!: string
}
