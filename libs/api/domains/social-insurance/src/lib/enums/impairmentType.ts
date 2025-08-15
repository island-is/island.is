import { registerEnumType } from '@nestjs/graphql'

export enum ImpairmentType {
  TYPE_0 = 0,
  TYPE_1 = 1,
}

registerEnumType(ImpairmentType, {
  name: 'SocialInsuranceMedicalDocumentsImpairmentType',
})
