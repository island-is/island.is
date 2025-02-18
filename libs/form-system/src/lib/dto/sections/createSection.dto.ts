import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  formId!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  displayOrder!: number
}
