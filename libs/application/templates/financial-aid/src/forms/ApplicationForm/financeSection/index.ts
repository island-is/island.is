import {
  buildCustomField,
  getValueViaPath,
  buildSection,
  buildSubSection,
  buildFileUploadField,
  buildDescriptionField,
  buildMultiField,
} from '@island.is/application/core'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { isVeitaMunicipality, taxSuccess } from '../../../utils/conditions'
import { ApproveOptions, TaxData } from '../../../lib/types'
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
            buildDescriptionField({
              id: Routes.RVKTAXRETURNFILESDESCRIPTION,
              description: taxReturnForm.general.description,
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
              id: Routes.RVKFINDTAXRETURNDESCRIPTION,
              title: taxReturnForm.instructions.findTaxReturnTitle,
              titleVariant: 'h3',
              description: taxReturnForm.instructions.findTaxReturn,
            }),
            buildDescriptionField({
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
