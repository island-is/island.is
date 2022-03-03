import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly hash!: string
}
