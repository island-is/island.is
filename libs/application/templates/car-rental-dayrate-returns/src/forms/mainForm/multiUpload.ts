import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { generateExcelSheet } from '../../utils/generateExcelSheet'
import { DayRateRecord } from '../../utils/types'
import { UploadSelection } from '../../utils/constants'
import { m } from '../../lib/messages'
import { Locale } from '@island.is/shared/types'

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
            id: 'multiUploadUploadCarDayRateUsageField',
            doesNotRequireAnswer: false,
            component: 'UploadCarDayRateUsage',
          },
          {
            getFileContent: (dayRateRecords: DayRateRecord[], locale: Locale) =>
              generateExcelSheet(dayRateRecords, locale),
          },
        ),
      ],
    }),
  ],
})
