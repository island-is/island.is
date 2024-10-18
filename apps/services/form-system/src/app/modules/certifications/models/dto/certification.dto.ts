import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { CertificationTypes } from '../../../../enums/certificationTypes'

export class CertificationDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty({ enum: CertificationTypes })
  certificationType!: string
}
