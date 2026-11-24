import { FamilyTypes, FieldTypesEnum } from '@island.is/form-system/enums'

const childInBothLists = {
  nationalId: '0101212989',
  fullName: 'Kynbarn í forsjá (mock)',
}

export const previewMockData = {
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
