import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Organization } from '../organization.model'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class OrganizationDto {
  @ApiProperty()
  name!: LanguageType

  @ApiProperty()
  nationalId!: string
}
