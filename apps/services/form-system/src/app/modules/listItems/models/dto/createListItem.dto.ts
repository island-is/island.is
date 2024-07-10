import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateListItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fieldId!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  displayOrder!: number
}
