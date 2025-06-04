import {
    buildAlertMessageField,
    buildCustomField,
    buildDescriptionField,
    buildDownloadFileButtonField,
    buildMultiField,
    buildSection,
    getValueViaPath,
  } from '@island.is/application/core'
import { generateExcelSheet } from '../../utils/generateExcelSheet'
import { RateCategory, UploadSelection } from '../../utils/constants'
import { CarCategoryRecord } from '../../utils/types'
  
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
        buildDownloadFileButtonField({
          id: 'multiUploadDownloadFileButtonField',
          getFileContent: () => generateExcelSheet('pass in data from external sources here'),
          buttonTitle: 'Sniðmát'
        }),
        buildCustomField({
          id: 'multiUploadUploadCatCategoryField',
          component: 'UploadCarCategoryFile',
          condition: (answers) => {
            const rateToChangeTo = getValueViaPath<string>(
              answers,
              'categorySelectionRadio',
            )

            return rateToChangeTo ? rateToChangeTo === RateCategory.DAYRATE : false
          }
        },
        {
          postParseAction: (records: CarCategoryRecord[]) => true,
          rateCategory: RateCategory.DAYRATE
        }),
        buildCustomField({
          id: 'multiUploadUploadCatCategoryField',
          component: 'UploadCarCategoryFile',
          condition: (answers) => {
            const rateToChangeTo = getValueViaPath<string>(
              answers,
              'categorySelectionRadio',
            )

            return rateToChangeTo ? rateToChangeTo === RateCategory.KMRATE : false
          }
        },
        {
          postParseAction: (records: CarCategoryRecord[]) => true,
          rateCategory: RateCategory.KMRATE
        })
      ],
    }),
  ],
})