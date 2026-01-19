import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { generateExcelSheet } from '../../utils/generateExcelSheet'
import { RateCategory, UploadSelection } from '../../utils/constants'
import { CarMap } from '../../utils/types'
import { m } from '../../lib/messages'

export const multiUploadSection = buildSection({
  condition: (answers) => {
    const uploadSelectionValue =
      getValueViaPath<string>(answers, 'singleOrMultiSelectionRadio') ??
      UploadSelection.MULTI

    return uploadSelectionValue
      ? uploadSelectionValue === UploadSelection.MULTI
      : false
  },
  id: 'multiUploadSection',
  title: m.multiUpload.sectionTitle,
  children: [
    buildMultiField({
      id: 'multiUploadMultiField',
      title: m.multiUpload.multiTitle,
      children: [
        buildDescriptionField({
          id: 'multiUploadDescription',
          description: m.multiUpload.description,
        }),
        buildAlertMessageField({
          id: 'multiUploadAlertMessageField',
          alertType: 'info',
          message: m.multiUpload.stepsMessage,
        }),
        buildCustomField(
          {
            id: 'multiUploadUploadCatCategoryField',
            doesNotRequireAnswer: false,
            component: 'UploadCarCategoryFile',
          },
          {
            getFileContent: (vehicleMap: CarMap, rateCategory: RateCategory) =>
              generateExcelSheet(vehicleMap, rateCategory),
          },
        ),
      ],
    }),
  ],
})
