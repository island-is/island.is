import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import { ApplicantTypesEnum } from '@island.is/form-system/shared'

export class ApplicantTypeName {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType
}

export const ApplicantTypeNames: ApplicantTypeName[] = [
  {
    id: ApplicantTypesEnum.INDIVIDUAL,
    name: {
      is: 'Umsækjandi',
      en: 'Applicant',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL,
    name: {
      is: 'Innsendandi',
      en: 'Submitting',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL,
    name: {
      is: 'Tilkynnandi',
      en: 'Announcing',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
    name: {
      is: 'Handhafi umboðs frá einstaklingi',
      en: 'Holder of delegation from individual',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
    name: {
      is: 'Handhafi umboðs frá lögaðila',
      en: 'Holder of delegation from legal entity',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION,
    name: {
      is: 'Prókúruhafi',
      en: 'Procuration holder',
    },
  },
  {
    id: ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
    name: {
      is: 'Umboðsveitandi - einstaklingur',
      en: 'Delegation provider - individual',
    },
  },
  {
    id: ApplicantTypesEnum.LEGAL_ENTITY,
    name: {
      is: 'Lögaðili',
      en: 'Legal entity',
    },
  },
]
