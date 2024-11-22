import {
  buildCustomField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'

export const taxReturnFilesSubSection = buildSubSection({
  id: Routes.TAXRETURNFILES,
  title: m.taxReturnForm.general.sectionTitle,
  condition: (_, externalData) => {
    const personalTaxSuccess = getValueViaPath<boolean>(
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
    buildCustomField({
      id: Routes.TAXRETURNFILES,
      title: m.taxReturnForm.general.pageTitle,
      component: 'TaxReturnFilesForm',
    }),
  ],
})
