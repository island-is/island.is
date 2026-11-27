import { FamilyTypes } from '@island.is/form-system/enums'
import { FieldTypesEnum } from './enums'

export const previewMockData = {
  [FieldTypesEnum.BANK_ACCOUNT]: {
    bankAccount: '0000-00-000000',
  },
  [FieldTypesEnum.FAMILY]: {
    [FamilyTypes.CHILD]: {
      formSystemCustodyChildren: [
        {
          nationalId: '0101212989',
          fullName: 'Barn í forsjá 1 (mock)',
        },
        {
          nationalId: '0101222989',
          fullName: 'Barn í forsjá 2 (mock)',
        },
      ],
    },
  },
}
