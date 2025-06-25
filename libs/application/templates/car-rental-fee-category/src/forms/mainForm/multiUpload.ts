import {
    buildAlertMessageField,
    buildCustomField,
    buildDescriptionField,
    buildMultiField,
    buildSection,
    buildSubmitField,
    getValueViaPath,
  } from '@island.is/application/core'
import { generateExcelSheet } from '../../utils/generateExcelSheet'
import { RateCategory, UploadSelection } from '../../utils/constants'
import { CarMap } from '../../utils/types'
  
export const multiUploadSection = buildSection({
  condition: (answers) => {
    const uploadSelectionValue = getValueViaPath<string>(
      answers,
      'singleOrMultiSelectionRadio',
    )

    return uploadSelectionValue ? uploadSelectionValue === UploadSelection.MULTI : false
  },
  id: 'multiUploadSection',
  title: 'Magn skráning',
  children: [
    buildMultiField({
      id: 'multiUploadMultiField',
      title: 'Skrá bifreiðar á kílómetragjald eða daggjald',
      children: [
        buildDescriptionField({
          id: 'multiUploadDescription',
          description: 'Veldur þær breytingar sem þú vilt gera', 
        }),
        buildAlertMessageField({
            id: 'multiUploadAlertMessageField',
            alertType: 'info',
            message: '1. Sæktu sniðmátið \n2. Gerðu viðeigandi breytingar á skjalinu \n3. Hleður upp skjalinu hér að neðan'
        }),
        buildCustomField({
          id: 'multiUploadUploadCatCategoryField',
          doesNotRequireAnswer: false,
          component: 'UploadCarCategoryFile',
        },
        {
          getFileContent: (vehicleMap: CarMap, rateCategory: RateCategory) => generateExcelSheet(vehicleMap, rateCategory)
        }),
        buildSubmitField({
          id: 'submit',
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'Submit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
