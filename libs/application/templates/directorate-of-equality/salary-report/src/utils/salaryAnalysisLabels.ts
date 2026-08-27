import type { FormatMessage } from '@island.is/localization'
import { messages } from '../lib/messages'

export type SalaryAnalysisGender = 'MALE' | 'FEMALE' | 'NEUTRAL'

export const formatSalaryAnalysisGenderLabel = (
  gender: SalaryAnalysisGender,
  formatMessage: FormatMessage,
): string => {
  const m = messages.salaryAnalysis.payDispersion
  if (gender === 'MALE') return formatMessage(m.genderMale)
  if (gender === 'FEMALE') return formatMessage(m.genderFemale)
  return formatMessage(m.genderNeutral)
}
