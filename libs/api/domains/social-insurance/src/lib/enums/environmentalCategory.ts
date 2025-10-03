import { registerEnumType } from '@nestjs/graphql'

export enum EnvironmentalCategory {
  CATEGORY_0 = 0,
  CATEGORY_1 = 1,
  CATEGORY_2 = 2,
  CATEGORY_3 = 3,
  CATEGORY_4 = 4,
  CATEGORY_5 = 5,
}

registerEnumType(EnvironmentalCategory, {
  name: 'SocialInsuranceMedicalDocumentsEnvironmentalCategory',
})
