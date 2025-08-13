import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import { CertificationTypesEnum } from '@island.is/form-system/shared'

export class CertificationType {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isCommon!: boolean
}

export const CertificationTypes: CertificationType[] = [
  {
    id: CertificationTypesEnum.ESTATE_GUARDIANSHIP_CERTIFICATE_STAMPED,
    name: {
      is: 'Búsforræðisvottorð',
      en: 'Certificate of authority to manage an estate',
    },
    description: {
      is: 'Búsforræðisvottorð með stimpli',
      en: 'A document stating that the party in question has custody of his estate, ie. has not been declared bankrupt.',
    },
    isCommon: false,
  },
  {
    id: CertificationTypesEnum.ESTATE_GUARDIANSHIP_CERTIFICATE_UNSTAMPED,
    name: {
      is: 'Búsforræðisvottorð án stimpils',
      en: 'Certificate of authority to manage an estate',
    },
    description: {
      is: 'Búsforræðisvottorð án stimpils',
      en: 'A document stating that the party in question has custody of his estate, ie. has not been declared bankrupt.',
    },
    isCommon: false,
  },
  {
    id: CertificationTypesEnum.RESIDENCE_CERTIFICATE,
    name: {
      is: 'Búsetuvottorð',
      en: 'Residence certificate',
    },
    description: {
      is: 'Búsetuvottorð',
      en: 'Residence certificate',
    },
    isCommon: false,
  },
  {
    id: CertificationTypesEnum.INDEBTEDNESS_CERTIFICATE,
    name: {
      is: 'Skuldleysisvottorð',
      en: 'Certificate of indebtedness',
    },
    description: {
      is: 'Skuldleysisvottorð',
      en: 'Certificate of indebtedness',
    },
    isCommon: false,
  },
  {
    id: CertificationTypesEnum.CRIMINAL_RECORD_STAMPED,
    name: {
      is: 'Sakavottorð',
      en: 'Criminal record',
    },
    description: {
      is: 'Sakavottorð með stimpli',
      en: 'Document containing your criminal record with stamp',
    },
    isCommon: false,
  },
  {
    id: CertificationTypesEnum.CRIMINAL_RECORD_UNSTAMPED,
    name: {
      is: 'Sakavottorð án stimpils',
      en: 'Criminal record without stamp',
    },
    description: {
      is: 'Sakavottorð án stimpils',
      en: 'Document containing your criminal record without stamp',
    },
    isCommon: false,
  },
]
