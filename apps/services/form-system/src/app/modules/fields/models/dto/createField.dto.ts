import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateFieldDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  screenId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fieldType!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  displayOrder!: number
}
