import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class FormCertificationDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: String })
  type!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType
}
