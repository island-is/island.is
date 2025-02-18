import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LanguageType {
  @IsString()
  @ApiProperty({ type: String, default: '' })
  is = ''

  @IsString()
  @ApiProperty({ type: String, default: '' })
  en = ''
}
