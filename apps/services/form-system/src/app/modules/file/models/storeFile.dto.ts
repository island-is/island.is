import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class StoreFileDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  fieldId!: string

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  sourceKey!: string

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  valueId!: string
}
