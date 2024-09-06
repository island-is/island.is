import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ApplicantTypes } from '../../../../enums/applicantTypes'

export class FormApplicantDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ enum: ApplicantTypes })
  applicantType!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType
}
