import {
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { ExternalData } from '../../../lib/types'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../../lib/constants'
import * as m from '../../../lib/messages'

export const taxReturnFilesSubSection = buildSubSection({
  id: Routes.TAXRETURNFILES,
  title: m.taxReturnForm.general.sectionTitle,
  condition: (_, externalData) =>
    (externalData as unknown as ExternalData).taxData?.data
      .municipalitiesDirectTaxPayments.success === false ||
    (externalData as unknown as ExternalData).taxData?.data
      ?.municipalitiesPersonalTaxReturn?.personalTaxReturn == null,
  children: [
    buildMultiField({
      id: Routes.TAXRETURNFILES,
      title: m.taxReturnForm.general.pageTitle,
      description: m.taxReturnForm.general.description,
      children: [
        buildFileUploadField({
          id: Routes.TAXRETURNFILES,
          title: '',
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
        }),
        buildDescriptionField({
          id: `${Routes.TAXRETURNFILES}.findTaxReturn`,
          title: m.taxReturnForm.instructions.findTaxReturnTitle,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.taxReturnForm.instructions.findTaxReturn,
        }),
        buildDescriptionField({
          id: `${Routes.TAXRETURNFILES}.findTaxReturn`,
          title: m.taxReturnForm.instructions.findDirectTaxPaymentsTitle,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.taxReturnForm.instructions.findDirectTaxPayments,
        }),
      ],
    }),
  ],
})
