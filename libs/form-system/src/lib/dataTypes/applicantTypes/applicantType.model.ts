import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import { ApplicantTypesEnum } from './applicantTypes.enum'
import { ApplicantTypeNames } from './applicantTypeName.model'

@InputType('FormSystemApplicantTypeInput')
@ObjectType('FormSystemApplicantType')
export class ApplicantType {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  description!: LanguageType

  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @ApiPropertyOptional({ type: [LanguageType] })
  @Field(() => [LanguageType], { nullable: 'itemsAndList' })
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
]
