import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
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

  const theCase = (caseFiles: CaseFile[]): WorkingCase =>
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
    } as WorkingCase)

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
  } as WorkingCase

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
        { verdictAppealCase: null } as WorkingCase,
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
        } as WorkingCase,
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
