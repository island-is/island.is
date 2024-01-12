import { registerEnumType } from '@nestjs/graphql'

export enum CaseCategoryType {
  TARRIF = 'Gjaldskrá',
  ANNOUNCEMENT = 'Auglýsing',
  REGULATION = 'Reglugerð',
  ORGANIZATIONAL_DOCUMENT = 'Skipulagsskrá',
  MOUNTAIN_APPROVAL = 'FJALLSKILASAMÞYKKT',
  RULES = 'Reglur',
  APPROVAL = 'Samþykkt',
}

registerEnumType(CaseCategoryType, {
  name: 'MinistryOfJusticeCaseCategoryType',
})
