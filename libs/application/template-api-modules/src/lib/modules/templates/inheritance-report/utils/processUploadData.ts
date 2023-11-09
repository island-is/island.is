// Expands Answers Data.
// See explanation in Mappers->Expanders

import { inheritanceReportSchema } from '@island.is/application/templates/inheritance-report'
import { infer as zinfer } from 'zod'
import { trueOrHasYes } from './mappers'

type InheritanceReportSchema = zinfer<typeof inheritanceReportSchema>

export const generateRawUploadData = (
  answers: InheritanceReportSchema,
): InheritanceReportSchema => {
  return {
    applicant: answers.applicant,
    approveExternalData: answers.approveExternalData,
    assets: {
      assetsTotal: answers.assets.assetsTotal ?? 0,
      bankAccounts: expandBankAccounts(answers.assets.bankAccounts?.data ?? []),
    },
  }
}
