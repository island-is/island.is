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
