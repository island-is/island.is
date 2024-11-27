import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../lib/constants'
import * as m from '../../lib/messages'
import { ExternalData } from '@island.is/application/types'

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
    buildCustomField({
      id: Routes.SPOUSETAXRETURNFILES,
      title: m.taxReturnForm.general.pageTitle,
      component: 'TaxReturnFilesForm',
    }),
  ],
})
