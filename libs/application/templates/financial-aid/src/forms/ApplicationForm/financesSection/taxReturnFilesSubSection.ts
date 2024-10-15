import {
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../../lib/constants'
import * as m from '../../../lib/messages'

export const taxReturnFilesSubSection = buildSubSection({
  id: Routes.TAXRETURNFILES,
  title: m.taxReturnForm.general.sectionTitle,
  condition: (_, externalData) => {
    const personalTaxSuccess = getValueViaPath(
      externalData,
      'taxData.data.municipalitiesDirectTaxPayments.success',
    )
    const personalTaxReturn = getValueViaPath(
      externalData,
      'taxData.data.municipalitiesPersonalTaxReturn.personalTaxReturn',
    )
    return personalTaxSuccess === false || personalTaxReturn == null
  },
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
          id: `${Routes.TAXRETURNFILES}.findTaxReturn2`,
          title: m.taxReturnForm.instructions.findDirectTaxPaymentsTitle,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.taxReturnForm.instructions.findDirectTaxPayments,
        }),
      ],
    }),
  ],
})
