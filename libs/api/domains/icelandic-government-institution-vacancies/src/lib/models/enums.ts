import { registerEnumType } from '@nestjs/graphql'

export enum VacancyLanguageEnum {
  IS = 'IS',
  EN = 'EN',
  ONLYEN = 'ONLYEN',
  ONLYIS = 'ONLYIS',
}

registerEnumType(VacancyLanguageEnum, {
  name: 'VacancyLanguageEnum',
})
