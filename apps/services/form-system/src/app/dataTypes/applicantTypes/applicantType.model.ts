import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import { ApplicantTypesEnum } from './applicantTypes.enum'
import { ApplicantTypeNames } from './applicantTypeName.model'

export class ApplicantType {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiPropertyOptional()
  formApplicantId?: string

  @ApiPropertyOptional({ type: LanguageType })
  name?: LanguageType

  @ApiPropertyOptional({ type: [LanguageType] })
  nameSuggestions?: LanguageType[]
}

export const ApplicantTypes: ApplicantType[] = [
  {
    id: ApplicantTypesEnum.INDIVIDUAL,
    description: {
      is: 'Innskráður einstaklingur',
      en: 'Signed in user',
    },
    nameSuggestions: ApplicantTypeNames.filter(
      (item) => item.id === ApplicantTypesEnum.INDIVIDUAL,
    ).map((item) => ({ is: item.name.is, en: item.name.en })),
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
    description: {
      is: 'Innskráður einstaklingur - handhafi umboðs frá einstaklingi',
      en: 'Logged in user - holder of delegation from individual',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
    description: {
      is: 'Innskráður einstaklingur - handhafi umboðs frá lögaðila',
      en: 'Logged in user - holder of delegation from legal entity',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
    description: {
      is: 'Innskráður einstaklingur - prókúruhafi',
      en: 'Logged in user - procuration holder',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
    description: {
      is: 'Umboðsveitandi - einstaklingur',
      en: 'Delegation provider - individual',
    },
  },
  {
    id: ApplicantTypesEnum.LEGAL_ENTITY,
    description: {
      is: 'Lögaðili',
      en: 'Legal entity',
    },
  },
]
