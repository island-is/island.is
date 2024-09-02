import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ScreenDisplayOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sectionId!: string
}
