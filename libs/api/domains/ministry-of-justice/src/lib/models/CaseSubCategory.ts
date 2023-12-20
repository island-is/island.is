import { registerEnumType } from '@nestjs/graphql'

export enum CaseSubCategoryType {
  BUILDING_REGULATION = 'Byggingarreglugerð',
  PORT_REGULATION = 'Hafnarreglugerð',
  ORGANIZATION_REGULATION = 'Skipulagsreglugerð',
}

registerEnumType(CaseSubCategoryType, {
  name: 'MinistryOfJusticeCaseSubCategoryType',
})
