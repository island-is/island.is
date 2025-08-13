import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import { ApplicantTypesEnum } from '@island.is/form-system/shared'
import { ApplicantTypeNames } from './applicantTypeName.model'

export class ApplicantType {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiPropertyOptional({ type: LanguageType })
  name?: LanguageType

  @ApiPropertyOptional({ type: [LanguageType] })
  nameSuggestions?: LanguageType[]
}

export const ApplicantTypes: ApplicantType[] = [
  {
    id: ApplicantTypesEnum.INDIVIDUAL,
    description: {
      is: 'Einstaklingur (innskráður)',
      en: 'Individual (logged in)',
    },
    nameSuggestions: ApplicantTypeNames.filter(
      (item) => item.id === ApplicantTypesEnum.INDIVIDUAL,
    ).map((item) => ({ is: item.name.is, en: item.name.en })),
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
    description: {
      is: 'Einstaklingur í umboði annars einstaklings',
      en: 'Individual with delegation from another individual',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
    description: {
      is: 'Einstaklingur í umboði lögaðila',
      en: 'Individual with delegation from legal entity',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
    description: {
      is: 'Einstaklingur með prókúru',
      en: 'Individual with procuration',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
    description: {
      is: 'Umboðsveitandi (einstaklingur)',
      en: 'Individual giving delegation',
    },
  },
  {
    id: ApplicantTypesEnum.LEGAL_ENTITY,
    description: {
      is: 'Lögaðili',
      en: 'Legal entity',
    },
  },
  {
    id: ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
    description: {
      is: 'Lögaðili prókúruhafa',
      en: 'Legal entity of procuration holder',
    },
  },
  {
    id: ApplicantTypesEnum.LEGAL_GUARDIAN,
    description: {
      is: 'Forráðamaður',
      en: 'Legal guardian',
    },
  },
]
