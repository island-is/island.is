import { registerEnumType } from '@nestjs/graphql'

export enum CaseDepartmentType {
  A = 'A-deild',
  B = 'B-deild',
  C = 'C-deild',
}
registerEnumType(CaseDepartmentType, {
  name: 'MinistryOfJusticeCaseDepartmentType',
  description: 'Possible types of case departments',
})
