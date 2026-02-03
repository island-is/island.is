import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { generateExcelSheet } from '../../utils/generateExcelSheet'
import { RateCategory } from '../../utils/constants'
import { CarMap } from '../../utils/types'
import { m } from '../../lib/messages'

export const multiUploadSection = buildSection({
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
            getFileContent: (vehicleMap: CarMap) =>
              generateExcelSheet(vehicleMap),
          },
        ),
      ],
    }),
  ],
})
