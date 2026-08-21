import { InstitutionNationalIds } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { DEV_INSTITUTION_TESTER_NATIONAL_ID } from './constants'
import { isHousingBenefitsNonProduction } from './prerequisiteMockDataUtils'

const sanitizeNationalId = (id: string) =>
  kennitala.isValid(id) ? kennitala.sanitize(id) : id

/**
 * Assignees for IN_REVIEW: always HMS, plus the gervimaður tester off production.
 * The tester is stripped from `existing` on production so a re-entry cannot keep them.
 */
export const buildInstitutionAssignees = (existing: string[]): string[] => {
  const hmsInstitutionNationalId = kennitala.sanitize(
    InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  )
  const testerNationalId = kennitala.sanitize(
    DEV_INSTITUTION_TESTER_NATIONAL_ID,
  )

  const withoutTester = existing
    .map(sanitizeNationalId)
    .filter((id) => id !== testerNationalId)

  const next = [...withoutTester, hmsInstitutionNationalId]
  if (isHousingBenefitsNonProduction()) {
    next.push(testerNationalId)
  }
  return [...new Set(next)]
}
