import { FamilyTypes } from '@island.is/form-system/enums'
import { FieldTypesEnum } from './enums'

const childInBothLists = {
  nationalId: '0101212989',
  fullName: 'Kynbarn í forsjá (mock)',
}

export const previewMockData = {
  [FieldTypesEnum.BANK_ACCOUNT]: {
    bankAccount: '0000-00-000000',
  },
  [FieldTypesEnum.FAMILY]: {
    [FamilyTypes.CHILD]: {
      nationalRegistryPerson: {
        biologicalChildren: [
          {
            nationalId: '0101202989',
            fullName: 'Kynbarn (mock)',
          },
          childInBothLists,
        ],
        childCustody: [
          childInBothLists,
          {
            nationalId: '0101222989',
            fullName: 'Barn í forsjá (mock)',
          },
        ],
      },
    },
  },
}
