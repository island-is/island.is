import { buildFileUploadField, buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { currencyStringToNumber } from '../../../utils/helpers'
import { FinancialStatementCemetery } from '../../../lib/dataSchema'

export const cemeteryFinancialStatementSection = buildSection({
  id: 'documents',
  title: m.financialStatement,
  children: [
    buildFileUploadField({
      id: 'attachments.file',
      title: m.upload,
      condition: (answers) => {
        const applicationAnswers = answers as FinancialStatementCemetery
        const careTakerLimit =
          applicationAnswers.cemeteryOperation?.incomeLimit ?? '0'
        const fixedAssetsTotal =
          applicationAnswers.cemeteryAsset?.fixedAssetsTotal
        const totalIncome = applicationAnswers.cemeteryIncome?.total
        const longTermDebt = applicationAnswers.cemeteryLiability?.longTerm
        const isUnderLimit =
          currencyStringToNumber(totalIncome) < careTakerLimit
        if (isUnderLimit && fixedAssetsTotal === '0' && longTermDebt === '0') {
          return false
        }
        return true
      },
      introduction: m.uploadIntro,
      description: m.uploadDescription,
      uploadHeader: m.uploadHeader,
      uploadAccept: '.pdf',
      uploadDescription: m.uploadAccept,
      uploadButtonLabel: m.uploadButtonLabel,
      uploadMultiple: false,
      forImageUpload: false,
    }),
  ],
})
