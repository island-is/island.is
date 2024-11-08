import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateValueDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  order!: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fieldId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  applicationId!: string
}
