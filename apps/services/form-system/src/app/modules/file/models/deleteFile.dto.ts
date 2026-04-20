import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteFileDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  key!: string

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  valueId!: string
}
