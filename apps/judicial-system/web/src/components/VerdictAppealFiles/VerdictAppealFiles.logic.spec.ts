import type {
  Case,
  CaseFile,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealCaseType,
  CaseFileCategory,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockUser } from '@island.is/judicial-system-web/src/utils/mocks'

import {
  getAppealAppointmentLetters,
  getVerdictAppealFileGroups,
  hasStandingVerdictAppeal,
  showsAppealSummonses,
} from './VerdictAppealFiles.logic'

describe('getVerdictAppealFileGroups', () => {
  const defenderNationalId = '1111111111'
  const user = {
    id: 'user_id',
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
  } as User

  const file = (
    id: string,
    defendantId: string,
    category: CaseFileCategory,
    created: string,
  ): CaseFile => ({ id, defendantId, category, created, name: `${id}.pdf` })

  const theCase = (caseFiles: CaseFile[]): Case =>
    ({
      id: 'case_id',
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: 'own_client_id',
          name: 'Eigin sakborningur',
          isDefenderChoiceConfirmed: true,
          defenderNationalId,
        },
        {
          id: 'other_client_id',
          name: 'Annar sakborningur',
          isDefenderChoiceConfirmed: true,
          defenderNationalId: '2222222222',
        },
      ],
      caseFiles,
    } as Case)

  it('should return nothing when no declaration has been filed', () => {
    expect(
      getVerdictAppealFileGroups(
        theCase([
          file(
            'a',
            'own_client_id',
            CaseFileCategory.DEFENDANT_CASE_FILE,
            '2026-06-04T13:34:00.000Z',
          ),
        ]),
        user,
      ),
    ).toEqual([])
  })

  it('should group the declaration and its files under the defendant, oldest first', () => {
    const groups = getVerdictAppealFileGroups(
      theCase([
        file(
          'attachment',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
          '2026-06-04T13:35:00.000Z',
        ),
        file(
          'declaration',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-04T13:34:00.000Z',
        ),
      ]),
      user,
    )

    expect(groups).toHaveLength(1)
    expect(groups[0].defendant.id).toBe('own_client_id')
    expect(groups[0].files.map((f) => f.id)).toEqual([
      'declaration',
      'attachment',
    ])
  })

  it('should leave out the files of a defendant this defender does not represent', () => {
    const groups = getVerdictAppealFileGroups(
      theCase([
        file(
          'own',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-04T13:34:00.000Z',
        ),
        file(
          'other',
          'other_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-05T13:34:00.000Z',
        ),
      ]),
      user,
    )

    expect(groups.map((g) => g.defendant.id)).toEqual(['own_client_id'])
  })

  it('should show a prosecution user every defendant, in case order', () => {
    const groups = getVerdictAppealFileGroups(
      theCase([
        file(
          'other',
          'other_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-03T13:34:00.000Z',
        ),
        file(
          'own',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-04T13:34:00.000Z',
        ),
      ]),
      mockUser(UserRole.PROSECUTOR),
    )

    expect(groups.map((g) => g.defendant.id)).toEqual([
      'own_client_id',
      'other_client_id',
    ])
  })

  // The declaration is one of the documents an appeal arrives at the court of
  // appeals with, so the court sees every defendant's - it is neither a
  // prosecution nor a defence user, so without naming it the shared rule
  // leaves it with nothing.
  it('should show the court of appeals every defendant', () => {
    const groups = getVerdictAppealFileGroups(
      theCase([
        file(
          'other',
          'other_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-03T13:34:00.000Z',
        ),
        file(
          'own',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-04T13:34:00.000Z',
        ),
      ]),
      mockUser(UserRole.COURT_OF_APPEALS_JUDGE),
    )

    expect(groups.map((g) => g.defendant.id)).toEqual([
      'own_client_id',
      'other_client_id',
    ])
  })

  // The public prosecution office acts on every appeal, and registers the ones
  // that arrive by letter, so it sees every defendant's declaration too.
  it('should show the public prosecution office every defendant', () => {
    const groups = getVerdictAppealFileGroups(
      theCase([
        file(
          'other',
          'other_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-03T13:34:00.000Z',
        ),
        file(
          'own',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-04T13:34:00.000Z',
        ),
      ]),
      mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
    )

    expect(groups.map((g) => g.defendant.id)).toEqual([
      'own_client_id',
      'other_client_id',
    ])
  })
})

describe('hasStandingVerdictAppeal', () => {
  it('is true for an appealed verdict appeal', () => {
    expect(
      hasStandingVerdictAppeal({
        appealState: AppealCaseState.APPEALED,
      }),
    ).toBe(true)
  })

  it('is false when the verdict appeal has been withdrawn', () => {
    expect(
      hasStandingVerdictAppeal({
        appealState: AppealCaseState.WITHDRAWN,
      }),
    ).toBe(false)
  })

  it('is false when there is no verdict appeal', () => {
    expect(hasStandingVerdictAppeal(null)).toBe(false)
    expect(hasStandingVerdictAppeal(undefined)).toBe(false)
  })
})

describe('showsAppealSummonses', () => {
  const appealed = {
    verdictAppealCase: {
      id: 'verdict_appeal_id',
      appealType: AppealCaseType.VERDICT,
      appealState: AppealCaseState.APPEALED,
    },
  } as Case

  it('shows the summonses to the public prosecution office on a verdict appeal', () => {
    expect(
      showsAppealSummonses(
        appealed,
        mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
      ),
    ).toBe(true)
  })

  it('shows nothing before the verdict is appealed', () => {
    expect(
      showsAppealSummonses(
        { verdictAppealCase: null } as Case,
        mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
      ),
    ).toBe(false)
  })

  it('shows nothing when the verdict appeal has been withdrawn', () => {
    expect(
      showsAppealSummonses(
        {
          verdictAppealCase: {
            id: 'verdict_appeal_id',
            appealType: AppealCaseType.VERDICT,
            appealState: AppealCaseState.WITHDRAWN,
          },
        } as Case,
        mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
      ),
    ).toBe(false)
  })

  // Defenders never see a summons. The Court of Appeals only sees the ones sent
  // to it, which arrive in a later step; until then it has nothing to show.
  it.each([
    UserRole.DEFENDER,
    UserRole.PROSECUTOR,
    UserRole.COURT_OF_APPEALS_JUDGE,
  ])('shows nothing to %s', (role) => {
    expect(showsAppealSummonses(appealed, mockUser(role))).toBe(false)
  })
})

describe('getAppealAppointmentLetters', () => {
  const appealedCase = (fields: Partial<Case> = {}): Case =>
    ({
      id: 'case_id',
      type: CaseType.INDICTMENT,
      verdictAppealCase: {
        id: 'verdict_appeal_id',
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.RECEIVED,
      },
      defendants: [
        {
          id: 'defendant_id',
          name: 'Gervimaður Jónsson',
          isAppealDefenderConfirmed: true,
          appealDefenderName: 'Þórður Már Jónsson',
        },
      ],
      civilClaimants: [],
      ...fields,
    } as Case)

  const coaUser = mockUser(UserRole.COURT_OF_APPEALS_REGISTRAR)

  it('offers a letter for each confirmed advocate', () => {
    expect(
      getAppealAppointmentLetters(
        appealedCase({
          civilClaimants: [
            {
              id: 'claimant_id',
              isAppealSpokespersonConfirmed: true,
              appealSpokespersonName: 'Brynjar Sveinsson',
            },
          ],
        } as Partial<Case>),
        coaUser,
      ),
    ).toEqual([
      {
        key: 'defendant-defendant_id',
        fileName: 'Skipunarbréf Þórður Már Jónsson.pdf',
        buttonLabel: 'Skipunarbréf Þórður Már Jónsson - PDF',
        elementId: [
          'defendant',
          'defendant_id',
          'Skipunarbréf Þórður Már Jónsson.pdf',
        ],
      },
      {
        key: 'civilClaimant-claimant_id',
        fileName: 'Skipunarbréf Brynjar Sveinsson.pdf',
        buttonLabel: 'Skipunarbréf Brynjar Sveinsson - PDF',
        elementId: [
          'civilClaimant',
          'claimant_id',
          'Skipunarbréf Brynjar Sveinsson.pdf',
        ],
      },
    ])
  })

  it('offers nothing for an advocate the court has not confirmed', () => {
    expect(
      getAppealAppointmentLetters(
        appealedCase({
          defendants: [
            {
              id: 'defendant_id',
              name: 'Gervimaður Jónsson',
              isAppealDefenderConfirmed: false,
              appealDefenderName: 'Þórður Már Jónsson',
            },
          ],
        } as Partial<Case>),
        coaUser,
      ),
    ).toEqual([])
  })

  // "Ákærði óskar ekki eftir verjanda": the screen confirms the answer while
  // clearing the name, so confirmed alone does not mean somebody was appointed.
  it('offers nothing for a defendant who waived a defender', () => {
    expect(
      getAppealAppointmentLetters(
        appealedCase({
          defendants: [
            {
              id: 'defendant_id',
              name: 'Gervimaður Jónsson',
              isAppealDefenderConfirmed: true,
              isAppealDefenderWaived: true,
            },
          ],
        } as Partial<Case>),
        coaUser,
      ),
    ).toEqual([])
  })

  it('offers nothing for a spokesperson the court has not confirmed', () => {
    expect(
      getAppealAppointmentLetters(
        appealedCase({
          defendants: [],
          civilClaimants: [
            {
              id: 'claimant_id',
              isAppealSpokespersonConfirmed: false,
              appealSpokespersonName: 'Brynjar Sveinsson',
            },
          ],
        } as Partial<Case>),
        coaUser,
      ),
    ).toEqual([])
  })

  // A réttargæslumaður is appointed by the court; a lögmaður is hired by the
  // claimant, and the court does not appoint what it did not choose.
  it('offers nothing for a lawyer the claimant engaged', () => {
    expect(
      getAppealAppointmentLetters(
        appealedCase({
          defendants: [],
          civilClaimants: [
            {
              id: 'claimant_id',
              isAppealSpokespersonConfirmed: true,
              appealSpokespersonIsLawyer: true,
              appealSpokespersonName: 'Brynjar Sveinsson',
            },
          ],
        } as Partial<Case>),
        coaUser,
      ),
    ).toEqual([])
  })

  it('offers nothing once the appeal is withdrawn', () => {
    expect(
      getAppealAppointmentLetters(
        appealedCase({
          verdictAppealCase: {
            id: 'verdict_appeal_id',
            appealType: AppealCaseType.VERDICT,
            appealState: AppealCaseState.WITHDRAWN,
          },
        } as Partial<Case>),
        coaUser,
      ),
    ).toEqual([])
  })

  // The court of appeals writes the letter and sends it; the advocate it
  // appoints is told by e-mail, and nobody else is party to the appointment.
  it.each([
    UserRole.DEFENDER,
    UserRole.PROSECUTOR,
    UserRole.PUBLIC_PROSECUTOR_STAFF,
  ])('offers nothing to %s', (role) => {
    expect(getAppealAppointmentLetters(appealedCase(), mockUser(role))).toEqual(
      [],
    )
  })
})
