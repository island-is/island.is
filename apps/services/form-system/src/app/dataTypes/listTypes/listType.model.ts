import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import { ListTypesEnum } from '@island.is/form-system/shared'

export class ListType {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isCommon!: boolean
}

export const ListTypes: ListType[] = [
  {
    id: ListTypesEnum.MUNICIPALITIES,
    name: { is: 'Sveitarfélög', en: 'Municipalities' },
    description: {
      is: 'Listi af sveitarfélögum landsins',
      en: 'List of Icelands municipalities',
    },
    isCommon: true,
  },
  {
    id: ListTypesEnum.COUNTRIES,
    name: { is: 'Landalisti', en: 'Countries' },
    description: {
      is: 'Listi af löndum heimsins',
      en: 'List of the countries of the world',
    },
    isCommon: true,
  },
  {
    id: ListTypesEnum.POSTAL_CODES,
    name: { is: 'Póstnúmer', en: 'Postal codes' },
    description: {
      is: 'Listi af póstnúmerum landsins',
      en: 'List of Icelands postal codes',
    },
    isCommon: true,
  },
]
