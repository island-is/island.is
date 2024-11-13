import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class FormApplicantTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  applicantTypeId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType
}
