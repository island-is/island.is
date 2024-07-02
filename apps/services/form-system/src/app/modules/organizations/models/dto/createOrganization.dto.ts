import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class CreateOrganizationDto {
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  nationalId!: string
}
