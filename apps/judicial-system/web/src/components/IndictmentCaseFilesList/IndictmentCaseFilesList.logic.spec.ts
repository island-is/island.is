import { InstitutionType, UserRole } from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system-web/src/graphql/schema'

import type { CaseFilesListCase } from './IndictmentCaseFilesList.logic'
import {
  getVisibleSubpoenas,
  shouldShowPoliceDigitalCaseFilesSection,
} from './IndictmentCaseFilesList.logic'

const user = (role: UserRole, type?: InstitutionType): User =>
  ({
    id: 'user-id',
    role,
    ...(type ? { institution: { id: 'institution-id', type } } : {}),
  } as User)

describe('shouldShowPoliceDigitalCaseFilesSection', () => {
  const files = [{ id: '1' }]

  it.each([
    [UserRole.PROSECUTOR, InstitutionType.POLICE_PROSECUTORS_OFFICE],
    [
      UserRole.PROSECUTOR_REPRESENTATIVE,
      InstitutionType.POLICE_PROSECUTORS_OFFICE,
    ],
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
      shouldShowPoliceDigitalCaseFilesSection(user(role, type), files, false),
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

describe('getVisibleSubpoenas', () => {
  const defenderNationalId = '1234567890'
  const otherNationalId = '0987654321'

  const theCase = {
    id: 'case-id',
    defendants: [
      {
        id: 'own-confirmed',
        isDefenderChoiceConfirmed: true,
        defenderNationalId,
        subpoenas: [{ id: 'subpoena-own-confirmed' }],
      },
      {
        id: 'own-unconfirmed',
        isDefenderChoiceConfirmed: false,
        defenderNationalId,
        subpoenas: [{ id: 'subpoena-own-unconfirmed' }],
      },
      {
        id: 'own-other',
        isDefenderChoiceConfirmed: true,
        defenderNationalId: otherNationalId,
        subpoenas: [{ id: 'subpoena-own-other' }],
      },
    ],
    splitCases: [
      {
        id: 'split-case-id',
        defendants: [
          {
            id: 'split-confirmed',
            isDefenderChoiceConfirmed: true,
            defenderNationalId,
            subpoenas: [{ id: 'subpoena-split-confirmed' }],
          },
          {
            id: 'split-other',
            isDefenderChoiceConfirmed: true,
            defenderNationalId: otherNationalId,
            subpoenas: [{ id: 'subpoena-split-other' }],
          },
        ],
      },
    ],
  } as unknown as CaseFilesListCase

  const subpoenaIds = (user?: User) =>
    getVisibleSubpoenas(theCase, user).map(({ subpoena }) => subpoena.id)

  it('shows every subpoena on the case and its split cases to the court', () => {
    expect(
      subpoenaIds(
        user(UserRole.DISTRICT_COURT_JUDGE, InstitutionType.DISTRICT_COURT),
      ),
    ).toEqual([
      'subpoena-own-confirmed',
      'subpoena-own-unconfirmed',
      'subpoena-own-other',
      'subpoena-split-confirmed',
      'subpoena-split-other',
    ])
  })

  it('shows a defender only the subpoenas of defendants they are confirmed for, in split cases too', () => {
    expect(
      subpoenaIds({
        ...user(UserRole.DEFENDER),
        nationalId: defenderNationalId,
      }),
    ).toEqual(['subpoena-own-confirmed', 'subpoena-split-confirmed'])
  })

  it('attributes every subpoena to the case being viewed', () => {
    expect(
      getVisibleSubpoenas(
        theCase,
        user(UserRole.DISTRICT_COURT_JUDGE, InstitutionType.DISTRICT_COURT),
      ).map(({ caseId }) => caseId),
    ).toEqual(Array(5).fill('case-id'))
  })

  it('shows nothing to a defender without a national id', () => {
    expect(subpoenaIds(user(UserRole.DEFENDER))).toEqual([])
  })
})
