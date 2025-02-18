import {
  buildCustomField,
  getValueViaPath,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { ApproveOptions, TaxData } from '../../../lib/types'
import { incomeSubsection } from './incomeSubsection'
import { personalTaxCreditSubsection } from './personalTaxCreditSubsection'
import { bankInfoSubsection } from './bankInfoSubsection'

export const financeSection = buildSection({
  id: 'finances',
  title: m.section.finances,
  children: [
    incomeSubsection,
    buildSubSection({
      condition: (answers) => {
        const income = getValueViaPath<ApproveOptions>(answers, 'income')
        return income === ApproveOptions.Yes
      },
      id: Routes.INCOMEFILES,
      title: m.incomeFilesForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.INCOMEFILES,
          title: m.incomeFilesForm.general.pageTitle,
          component: 'IncomeFilesForm',
        }),
      ],
    }),
    buildSubSection({
      condition: (_, externalData) => {
        const taxData = getValueViaPath<TaxData>(externalData, 'taxData.data')
        const success = taxData?.municipalitiesDirectTaxPayments.success
        const personalTaxReturn =
          taxData?.municipalitiesPersonalTaxReturn?.personalTaxReturn
        return success === false || personalTaxReturn == null
      },
      id: Routes.TAXRETURNFILES,
      title: m.taxReturnForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.TAXRETURNFILES,
          title: m.taxReturnForm.general.pageTitle,
          component: 'TaxReturnFilesForm',
        }),
      ],
    }),
    personalTaxCreditSubsection,
    bankInfoSubsection,
  ],
})
