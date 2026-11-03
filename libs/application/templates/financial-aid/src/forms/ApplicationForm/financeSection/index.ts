import {
  buildCustomField,
  getValueViaPath,
  buildSection,
  buildSubSection,
  buildFileUploadField,
  buildDescriptionField,
  buildMultiField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import {
  directTaxPaymentsFailed,
  isVeitaMunicipality,
  needsTaxFiles,
  taxReturnFailed,
  taxSuccess,
} from '../../../utils/conditions'
import { ApproveOptions } from '../../../lib/types'
import { incomeSubsection } from './incomeSubsection'
import { personalTaxCreditSubsection } from './personalTaxCreditSubsection'
import { bankInfoSubsection } from './bankInfoSubsection'
import { incomeFilesForm, taxReturnForm } from '../../../lib/messages'

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
          condition: (_answers, externalData) =>
            !isVeitaMunicipality(_answers, externalData),
          id: Routes.INCOMEFILES,
          title: m.incomeFilesForm.general.pageTitle,
          component: 'IncomeFilesForm',
        }),
        buildMultiField({
          condition: isVeitaMunicipality,
          id: Routes.INCOMEFILESTAXSUCCESS,
          title: m.incomeFilesForm.general.pageTitle,
          children: [
            buildDescriptionField({
              condition: taxSuccess,
              id: Routes.INCOMEFILESTAXSUCCESS,
              description: incomeFilesForm.general.descriptionTaxSuccess,
            }),
            buildDescriptionField({
              condition: (_answers, externalData) =>
                !taxSuccess(_answers, externalData),
              id: Routes.INCOMEFILESTAXSUCCESS,
              description: incomeFilesForm.general.description,
            }),
            buildFileUploadField({
              condition: isVeitaMunicipality,
              id: Routes.RVKINCOMEFILES,
              title: m.incomeFilesForm.general.pageTitle,
              uploadAccept: UPLOAD_ACCEPT.join(','),
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText: m.filesText.sizeErrorMessage,
              uploadHeader: m.filesText.header,
              uploadButtonLabel: m.filesText.buttonLabel,
              uploadMultiple: true,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      condition: (_, externalData) => needsTaxFiles(externalData),
      id: Routes.TAXRETURNFILES,
      title: m.taxReturnForm.general.sectionTitle,
      children: [
        buildCustomField({
          condition: (_answers, externalData) =>
            !isVeitaMunicipality(_answers, externalData),
          id: Routes.TAXRETURNFILES,
          title: m.taxReturnForm.general.pageTitle,
          component: 'TaxReturnFilesForm',
        }),
        buildMultiField({
          condition: isVeitaMunicipality,
          id: Routes.RVKTAXRETURNFILESMULTIFIELD,
          title: m.taxReturnForm.general.pageTitle,
          children: [
            buildAlertMessageField({
              condition: (_, externalData) =>
                taxReturnFailed(externalData) &&
                directTaxPaymentsFailed(externalData),
              id: Routes.RVKTAXRETURNFILESALERT,
              title: taxReturnForm.alertMessage.title,
              message: taxReturnForm.alertMessage.message,
              alertType: 'error',
            }),
            buildDescriptionField({
              condition: (_, externalData) =>
                taxReturnFailed(externalData) &&
                directTaxPaymentsFailed(externalData),
              id: Routes.RVKTAXRETURNFILESDESCRIPTION,
              description: taxReturnForm.general.description,
            }),
            buildDescriptionField({
              condition: (_, externalData) =>
                taxReturnFailed(externalData) &&
                !directTaxPaymentsFailed(externalData),
              id: Routes.RVKTAXRETURNFILESDESCRIPTION,
              description: taxReturnForm.data.directTaxPaymentsFailed,
            }),
            buildDescriptionField({
              condition: (_, externalData) =>
                directTaxPaymentsFailed(externalData) &&
                !taxReturnFailed(externalData),
              id: Routes.RVKTAXRETURNFILESDESCRIPTION,
              description: taxReturnForm.data.taxReturnFailed,
            }),
            buildFileUploadField({
              condition: isVeitaMunicipality,
              id: Routes.RVKTAXRETURNFILES,
              title: m.taxReturnForm.general.pageTitle,
              uploadAccept: UPLOAD_ACCEPT.join(','),
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText: m.filesText.sizeErrorMessage,
              uploadHeader: m.filesText.header,
              uploadButtonLabel: m.filesText.buttonLabel,
              uploadMultiple: true,
            }),
            buildDescriptionField({
              condition: (_, externalData) => taxReturnFailed(externalData),
              id: Routes.RVKFINDTAXRETURNDESCRIPTION,
              title: taxReturnForm.instructions.findTaxReturnTitle,
              titleVariant: 'h3',
              description: taxReturnForm.instructions.findTaxReturn,
            }),
            buildDescriptionField({
              condition: (_, externalData) =>
                directTaxPaymentsFailed(externalData),
              id: Routes.RVKFINDDIRECTTAXPAYMENTSDESCRIPTION,
              titleVariant: 'h3',
              title: taxReturnForm.instructions.findDirectTaxPaymentsTitle,
              description: taxReturnForm.instructions.findDirectTaxPayments,
            }),
          ],
        }),
      ],
    }),
    personalTaxCreditSubsection,
    bankInfoSubsection,
  ],
})
