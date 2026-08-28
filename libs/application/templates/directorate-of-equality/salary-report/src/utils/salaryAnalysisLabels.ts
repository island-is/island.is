import type { FormatMessage } from '@island.is/localization'
import { messages } from '../lib/messages'
import type { PayStatus } from './outlierGroups'
import { formatSignedPercentMagnitude } from './wageGap'

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

/**
 * "undir" / "yfir" / "á línu" — where an employee sits relative to the fitted
 * line. Shared by the úrbótaáætlun table, the ábendingar table and the chart
 * tooltip, all three of which show the same figure and must gloss it the same
 * way.
 */
export const formatPayStatusLabel = (
  payStatus: PayStatus,
  formatMessage: FormatMessage,
): string => {
  const m = messages.salaryAnalysis.outlierGroup
  return formatMessage(
    payStatus === 'UNDERPAID'
      ? m.payStatusUnderpaid
      : payStatus === 'OVERPAID'
      ? m.payStatusOverpaid
      : m.payStatusOnLine,
  )
}

/**
 * Launafrávik as "{sign}{magnitude}% ({status})".
 *
 * Signed here, unlike the company-level gender gaps: this is a deviation from a
 * fitted line, so the sign is meaningful and the word glosses it. The company
 * figures are magnitude-only because their sign would imply a denominator
 * convention the reader does not have.
 *
 * payStatus is rendered, not inferred from the sign. A row can be listed for
 * being paid ABOVE what their stig imply, which is the opposite of what a
 * reader expects, and deviationPercent's sign only conveys that to someone who
 * already knows the convention.
 *
 * The status word is always shown, ON_LINE included — a bare percentage with no
 * gloss is the one rendering that leaves the direction to the reader to guess.
 *
 * The sign comes from `formatSignedPercentMagnitude` rather than being derived
 * here from the raw value, because it has to agree with the ROUNDED magnitude it
 * sits in front of. Deriving it from the unrounded figure renders a deviation of
 * −0,04% as "-0,0%" — a signed zero, which wageGap.spec pins as suppressed. So
 * `sign` is passed empty: the message keeps its `{sign}` slot for the published
 * translations, and the signed magnitude arrives whole in `{value}`.
 */
export const formatDeviationLabel = (
  deviationPercent: number,
  payStatus: PayStatus,
  formatMessage: FormatMessage,
): string => {
  const m = messages.salaryAnalysis.outlierGroup
  return formatMessage(m.deviationCell, {
    sign: '',
    value: formatSignedPercentMagnitude(deviationPercent),
    status: formatPayStatusLabel(payStatus, formatMessage),
  })
}
