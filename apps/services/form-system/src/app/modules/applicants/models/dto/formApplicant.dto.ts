import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class FormApplicantDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  applicantType!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType
}
