import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class FieldDisplayOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  screenId!: string
}
