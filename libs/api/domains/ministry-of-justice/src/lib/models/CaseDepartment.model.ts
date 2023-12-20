import { registerEnumType } from '@nestjs/graphql'

export enum CaseDepartmentType {
  A = 'A-Deild',
  B = 'B-Deild',
  C = 'C-Deild',
  D = 'D-Deild',
}
registerEnumType(CaseDepartmentType, {
  name: 'MinistryOfJusticeCaseDepartmentType',
  description: 'Possible types of case departments',
})
