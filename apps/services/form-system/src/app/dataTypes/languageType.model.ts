import { ApiProperty } from '@nestjs/swagger'

export class LanguageType {
  @ApiProperty()
  is!: string

  @ApiProperty()
  en!: string
}
