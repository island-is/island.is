import { Gender } from '@island.is/application/templates/directorate-of-equality/equality-report'

const companyAdminGenderMap: Record<Gender, 'MALE' | 'FEMALE' | 'NEUTRAL'> = {
  [Gender.MALE]: 'MALE',
  [Gender.FEMALE]: 'FEMALE',
  [Gender.NON_BINARY]: 'NEUTRAL',
}

export const mapGender = (gender?: string): 'MALE' | 'FEMALE' | 'NEUTRAL' =>
  companyAdminGenderMap[gender as Gender] ?? 'NEUTRAL'

export const toNumberOrZero = (number: string | undefined) => {
  if (!number) {
    return 0
  }

  const parsed = Number(number)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

type SubsidiaryAnswers = {
  includesSubsidiaries?: string
  list?: Array<{
    nationalIdWithName?: { name?: string; nationalId?: string }
    isRemoved?: boolean
  }>
}

/**
 * Subsidiaries as DMR expects them: nothing at all unless the applicant said
 * yes, and never a row the applicant deleted — the table flags those rather
 * than dropping them, so they can still be sitting in answers.
 */
export const mapSubsidiaries = (subsidiaries?: SubsidiaryAnswers) => {
  if (subsidiaries?.includesSubsidiaries !== 'yes') return []

  return (subsidiaries.list ?? [])
    .filter((s) => !s.isRemoved)
    .map((s) => ({
      name: s.nationalIdWithName?.name ?? '',
      nationalId: s.nationalIdWithName?.nationalId ?? '',
    }))
}
