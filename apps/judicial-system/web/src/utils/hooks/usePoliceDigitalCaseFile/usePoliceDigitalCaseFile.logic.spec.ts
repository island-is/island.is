import {
  InstitutionType,
  type InstitutionUser,
  UserRole,
} from '@island.is/judicial-system/types'

import { canAccessPoliceDigitalCaseFiles } from './usePoliceDigitalCaseFile.logic'

const user = (role: UserRole, type: InstitutionType): InstitutionUser => ({
  role,
  institution: { type },
})

describe('canAccessPoliceDigitalCaseFiles', () => {
  it.each([
    [UserRole.PROSECUTOR, InstitutionType.POLICE_PROSECUTORS_OFFICE],
    [UserRole.PROSECUTOR, InstitutionType.DISTRICT_PROSECUTORS_OFFICE],
    [UserRole.PROSECUTOR, InstitutionType.PUBLIC_PROSECUTORS_OFFICE],
    [
      UserRole.PROSECUTOR_REPRESENTATIVE,
      InstitutionType.POLICE_PROSECUTORS_OFFICE,
    ],
    [UserRole.DISTRICT_COURT_JUDGE, InstitutionType.DISTRICT_COURT],
    [UserRole.DISTRICT_COURT_REGISTRAR, InstitutionType.DISTRICT_COURT],
    [UserRole.DISTRICT_COURT_ASSISTANT, InstitutionType.DISTRICT_COURT],
    [UserRole.COURT_OF_APPEALS_JUDGE, InstitutionType.COURT_OF_APPEALS],
    [UserRole.COURT_OF_APPEALS_REGISTRAR, InstitutionType.COURT_OF_APPEALS],
    [UserRole.COURT_OF_APPEALS_ASSISTANT, InstitutionType.COURT_OF_APPEALS],
  ])('allows %s at %s', (role, type) => {
    expect(canAccessPoliceDigitalCaseFiles(user(role, type))).toBe(true)
  })

  it.each([
    [UserRole.PRISON_SYSTEM_STAFF, InstitutionType.PRISON],
    [UserRole.PRISON_SYSTEM_STAFF, InstitutionType.PRISON_ADMIN],
    [
      UserRole.PUBLIC_PROSECUTOR_STAFF,
      InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    ],
    [UserRole.LOCAL_ADMIN, InstitutionType.DISTRICT_COURT],
    [UserRole.ADMIN, InstitutionType.DISTRICT_COURT],
  ])('denies %s at %s', (role, type) => {
    expect(canAccessPoliceDigitalCaseFiles(user(role, type))).toBe(false)
  })

  it('denies defenders, who have no institution', () => {
    expect(canAccessPoliceDigitalCaseFiles({ role: UserRole.DEFENDER })).toBe(
      false,
    )
  })

  it('denies while the user has not loaded yet', () => {
    expect(canAccessPoliceDigitalCaseFiles(undefined)).toBe(false)
  })
})
