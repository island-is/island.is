import {
  InstitutionType,
  type InstitutionUser,
  UserRole,
} from '@island.is/judicial-system/types'

import { shouldShowPoliceDigitalCaseFilesSection } from './IndictmentCaseFilesList.logic'

const user = (role: UserRole, type?: InstitutionType): InstitutionUser => ({
  role,
  ...(type ? { institution: { type } } : {}),
})

describe('shouldShowPoliceDigitalCaseFilesSection', () => {
  const files = [{ id: '1' }]

  it.each([
    [UserRole.PROSECUTOR, InstitutionType.POLICE_PROSECUTORS_OFFICE],
    [UserRole.PROSECUTOR_REPRESENTATIVE, InstitutionType.POLICE_PROSECUTORS_OFFICE],
    [UserRole.DISTRICT_COURT_JUDGE, InstitutionType.DISTRICT_COURT],
    [UserRole.COURT_OF_APPEALS_JUDGE, InstitutionType.COURT_OF_APPEALS],
  ])('shows files for %s at %s', (role, type) => {
    expect(
      shouldShowPoliceDigitalCaseFilesSection(user(role, type), files, false),
    ).toBe(true)
  })

  it('shows the section while files are loading for prosecutors', () => {
    expect(
      shouldShowPoliceDigitalCaseFilesSection(
        user(UserRole.PROSECUTOR, InstitutionType.POLICE_PROSECUTORS_OFFICE),
        undefined,
        true,
      ),
    ).toBe(true)
  })

  it.each([
    [UserRole.DEFENDER, undefined],
    [UserRole.PRISON_SYSTEM_STAFF, InstitutionType.PRISON],
    [
      UserRole.PUBLIC_PROSECUTOR_STAFF,
      InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    ],
  ])('hides files for %s', (role, type) => {
    expect(
      shouldShowPoliceDigitalCaseFilesSection(
        user(role, type),
        files,
        false,
      ),
    ).toBe(false)
  })

  it('hides the section when there are no files and nothing is loading', () => {
    expect(
      shouldShowPoliceDigitalCaseFilesSection(
        user(UserRole.PROSECUTOR, InstitutionType.POLICE_PROSECUTORS_OFFICE),
        [],
        false,
      ),
    ).toBe(false)
  })
})
