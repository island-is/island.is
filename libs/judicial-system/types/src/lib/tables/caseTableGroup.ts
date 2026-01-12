import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isProsecutorRepresentativeUser,
  isProsecutorUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
} from '../user'
import { courtOfAppealsTableGroups } from './tableGroups/courtOfAppeals'
import { districtCourtTableGroups } from './tableGroups/districtCourt'
import { prisonAdminTableGroups } from './tableGroups/prisonAdmin'
import { prisonStaffTableGroups } from './tableGroups/prisonStaff'
import { prosecutorTableGroups } from './tableGroups/prosecutor'
import { prosecutorRepresentativeTableGroups } from './tableGroups/prosecutorRepresentative'
import { publicProsecutionTableGroups } from './tableGroups/publicProsecution'
import { publicProsecutionOfficeTableGroups } from './tableGroups/publicProsecutionOffice'
import { CaseTableGroup } from './caseTableTypes'

export const getCaseTableGroups = (
  user: InstitutionUser | undefined,
): CaseTableGroup[] => {
  if (isCourtOfAppealsUser(user)) {
    return courtOfAppealsTableGroups
  }

  if (isDistrictCourtUser(user)) {
    return districtCourtTableGroups
  }

  if (isPrisonStaffUser(user)) {
    return prisonStaffTableGroups
  }

  if (isPrisonAdminUser(user)) {
    return prisonAdminTableGroups
  }

  if (isPublicProsecutionOfficeUser(user)) {
    return publicProsecutionOfficeTableGroups
  }

  if (isPublicProsecutionUser(user)) {
    return publicProsecutionTableGroups
  }

  if (isProsecutorUser(user)) {
    return prosecutorTableGroups
  }

  if (isProsecutorRepresentativeUser(user)) {
    return prosecutorRepresentativeTableGroups
  }

  return []
}
