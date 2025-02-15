import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateScreenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sectionId!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  displayOrder!: number
}
