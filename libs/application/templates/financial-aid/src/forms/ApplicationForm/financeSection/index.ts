import {
  buildCustomField,
  buildFileUploadField,
  getValueViaPath,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
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
        buildFileUploadField({
          id: Routes.INCOMEFILES,
          title: m.incomeFilesForm.general.pageTitle,
          introduction: (application: Application) => {
            const success = getValueViaPath<boolean>(
              application.externalData,
              'taxData.data.municipalitiesDirectTaxPayments.success',
            )
            return success
              ? m.incomeFilesForm.general.descriptionTaxSuccess
              : m.incomeFilesForm.general.description
          },
          uploadMultiple: true,
          uploadHeader: m.filesText.header,
          uploadDescription: m.filesText.description,
          uploadButtonLabel: m.filesText.buttonLabel,
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
