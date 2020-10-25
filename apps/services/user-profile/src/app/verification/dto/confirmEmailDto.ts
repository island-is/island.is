import {
  IsNotEmpty,
  IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ConfirmEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly hash!: string
}
