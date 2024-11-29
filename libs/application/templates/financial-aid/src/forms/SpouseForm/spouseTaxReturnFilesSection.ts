import {
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../lib/constants'
import * as m from '../../lib/messages'

export const spouseTaxReturnFilesSection = buildSection({
  condition: (_, externalData) => {
    const spouseTaxSuccess = getValueViaPath<boolean>(
      externalData,
      'taxDataSpouse.data.municipalitiesDirectTaxPayments.success',
    )
    const spouseTaxReturn = getValueViaPath(
      externalData,
      'taxDataSpouse.data.municipalitiesPersonalTaxReturn.personalTaxReturn',
    )
    return spouseTaxSuccess === false || spouseTaxReturn == null
  },
  id: Routes.SPOUSETAXRETURNFILES,
  title: m.taxReturnForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSETAXRETURNFILES,
      title: m.taxReturnForm.general.pageTitle,
      children: [
        buildDescriptionField({
          id: `${Routes.SPOUSETAXRETURNFILES}-description`,
          title: '',
          description: m.taxReturnForm.general.description,
          marginBottom: 3,
        }),
        buildFileUploadField({
          id: Routes.SPOUSETAXRETURNFILES,
          title: '',
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
        }),
        buildDescriptionField({
          id: `${Routes.SPOUSETAXRETURNFILES}.findTaxReturn`,
          title: m.taxReturnForm.instructions.findTaxReturnTitle,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.taxReturnForm.instructions.findTaxReturn,
        }),
        buildDescriptionField({
          id: `${Routes.SPOUSETAXRETURNFILES}.findTaxReturn2`,
          title: m.taxReturnForm.instructions.findDirectTaxPaymentsTitle,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.taxReturnForm.instructions.findDirectTaxPayments,
        }),
      ],
    }),
  ],
})
