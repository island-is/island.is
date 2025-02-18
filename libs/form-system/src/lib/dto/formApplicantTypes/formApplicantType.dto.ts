import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty } from '@nestjs/swagger'

export class FormApplicantTypeDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  applicantTypeId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType
}
