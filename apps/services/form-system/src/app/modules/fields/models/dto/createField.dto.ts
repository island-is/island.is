import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFieldDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  screenId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fieldType!: string
}
