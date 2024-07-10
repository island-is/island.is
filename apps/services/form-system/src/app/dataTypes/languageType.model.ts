import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LanguageType {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  is!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  en!: string
}
