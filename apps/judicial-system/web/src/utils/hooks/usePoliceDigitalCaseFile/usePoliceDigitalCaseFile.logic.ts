import {
  type InstitutionUser,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'

// Mirrors the role rules on the backend's policeDigitalCaseFiles endpoints.
// Prison staff, public prosecutor staff and defenders are rejected with a 403
// there, so the hook must not query on their behalf.
export const canAccessPoliceDigitalCaseFiles = (
  user?: InstitutionUser,
): boolean =>
  isProsecutionUser(user) ||
  isDistrictCourtUser(user) ||
  isCourtOfAppealsUser(user)
