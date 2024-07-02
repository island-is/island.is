import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Organization } from '../organization.model'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class OrganizationDto {
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  nationalId!: string
}
