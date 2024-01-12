import { registerEnumType } from '@nestjs/graphql'

export enum CaseSignatureType {
  SINGLE = 'Einföld undirritun',
  DOUBLE = 'Tvöföld undirritun',
  MINISTER = 'Undirritun ráðherra',
  COMMITTEE = 'Undirritun nefndar',
}

registerEnumType(CaseSignatureType, {
  name: 'MinistryOfJusticeCaseSignatureType',
})
