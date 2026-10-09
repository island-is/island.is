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
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockUser } from '@island.is/judicial-system-web/src/utils/mocks'

import {
  canConfirmAppealSummonsRow,
  canShowIssueAppealSummons,
  formatAppealSummonsConfirmedDate,
  formatAppealSummonsFileName,
  formatAppealSummonsSentToCourtOfAppealsTooltip,
  getAppealSummonsMenuItems,
  getAppealSummonsRows,
  getVerdictAppealFileGroups,
  hasStandingVerdictAppeal,
  showsAppealSummonses,
} from './VerdictAppealFiles.logic'

const publicProsecutorUser = (): User => {
  const user = mockUser(UserRole.PROSECUTOR)

  return {
    ...user,
    institution: {
      ...(user.institution ?? {
        id: '',
        created: '',
        modified: '',
        name: '',
        active: true,
        type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE,
      }),
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  }
}

describe('formatAppealSummonsFileName', () => {
  it('appends the created date to the file name', () => {
    expect(
      formatAppealSummonsFileName({ created: '2026-10-07T12:00:00.000Z' }),
    ).toBe('Áfrýjunarstefna 07.10.2026.pdf')
  })

  it('falls back when created is missing', () => {
    expect(formatAppealSummonsFileName({})).toBe('Áfrýjunarstefna.pdf')
  })
})

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

  it('shows the summonses to a prosecutor at the public prosecutor office', () => {
    expect(showsAppealSummonses(appealed, publicProsecutorUser())).toBe(true)
  })

  // Defenders never see a summons. District prosecutors keep their own overview.
  it.each([UserRole.DEFENDER, UserRole.PROSECUTOR])(
    'shows nothing to %s outside the public prosecutor office',
    (role) => {
      expect(showsAppealSummonses(appealed, mockUser(role))).toBe(false)
    },
  )

  it('shows sent summonses to the court of appeals', () => {
    expect(
      showsAppealSummonses(
        {
          verdictAppealCase: {
            ...appealed.verdictAppealCase,
            sentAppealSummonses: [{ id: 'sent' }],
          },
        } as Case,
        mockUser(UserRole.COURT_OF_APPEALS_JUDGE),
      ),
    ).toBe(true)
  })

  it('hides the summons block from the court of appeals when none have been sent', () => {
    expect(
      showsAppealSummonses(
        appealed,
        mockUser(UserRole.COURT_OF_APPEALS_JUDGE),
      ),
    ).toBe(false)
  })
})

describe('getAppealSummonsRows', () => {
  it('returns sent summonses for the court of appeals', () => {
    const sent = [{ id: 'sent' }]
    const draft = [{ id: 'draft' }]

    expect(
      getAppealSummonsRows(
        {
          verdictAppealCase: {
            appealSummonses: draft,
            sentAppealSummonses: sent,
          },
        } as Case,
        mockUser(UserRole.COURT_OF_APPEALS_JUDGE),
      ),
    ).toEqual(sent)
  })

  it('returns all summonses for staff', () => {
    const summonses = [{ id: 'draft' }]

    expect(
      getAppealSummonsRows(
        {
          verdictAppealCase: {
            appealSummonses: summonses,
            sentAppealSummonses: [{ id: 'sent' }],
          },
        } as Case,
        mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
      ),
    ).toEqual(summonses)
  })
})

describe('canConfirmAppealSummonsRow', () => {
  it('lets a public prosecution prosecutor confirm a draft', () => {
    expect(canConfirmAppealSummonsRow({}, publicProsecutorUser())).toBe(true)
  })

  it('does not let staff confirm', () => {
    expect(
      canConfirmAppealSummonsRow({}, mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF)),
    ).toBe(false)
  })

  it('does not offer confirm once the summons is confirmed', () => {
    expect(
      canConfirmAppealSummonsRow(
        { confirmedDate: '2026-06-05T09:15:00.000Z' },
        publicProsecutorUser(),
      ),
    ).toBe(false)
  })
})

describe('formatAppealSummonsConfirmedDate', () => {
  it('formats the confirmation date and time', () => {
    expect(
      formatAppealSummonsConfirmedDate('2026-06-05T09:15:00.000Z'),
    ).toMatch(/05\.06\.2026 kl\. \d{2}:\d{2}/)
  })

  it('returns undefined when there is no date', () => {
    expect(formatAppealSummonsConfirmedDate(null)).toBeUndefined()
    expect(formatAppealSummonsConfirmedDate(undefined)).toBeUndefined()
  })
})

describe('canShowIssueAppealSummons', () => {
  it('offers the button to public prosecution office staff on a verdict appeal', () => {
    expect(
      canShowIssueAppealSummons(
        {
          verdictAppealCase: {
            id: 'verdict_appeal_id',
            appealType: AppealCaseType.VERDICT,
            appealState: AppealCaseState.APPEALED,
          },
        } as Case,
        mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
      ),
    ).toBe(true)
  })

  it('hides the button when the verdict appeal has been withdrawn', () => {
    expect(
      canShowIssueAppealSummons(
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

  it.each([UserRole.DEFENDER, UserRole.COURT_OF_APPEALS_JUDGE])(
    'hides the button from %s',
    (role) => {
      expect(
        canShowIssueAppealSummons(
          {
            verdictAppealCase: {
              id: 'verdict_appeal_id',
              appealType: AppealCaseType.VERDICT,
              appealState: AppealCaseState.APPEALED,
            },
          } as Case,
          mockUser(role),
        ),
      ).toBe(false)
    },
  )
})

describe('formatAppealSummonsSentToCourtOfAppealsTooltip', () => {
  it('formats the send date', () => {
    expect(
      formatAppealSummonsSentToCourtOfAppealsTooltip(
        '2026-06-10T10:00:00.000Z',
      ),
    ).toBe('Sent til Landsréttar 10.06.2026')
  })

  it('returns undefined when there is no date', () => {
    expect(
      formatAppealSummonsSentToCourtOfAppealsTooltip(null),
    ).toBeUndefined()
  })
})

describe('getAppealSummonsMenuItems', () => {
  it('offers edit, open and delete on a draft for staff', () => {
    expect(
      getAppealSummonsMenuItems(
        {},
        mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ).map((item) => item.title),
    ).toEqual(['Breyta', 'Opna í nýjum flipa', 'Eyða'])
  })

  it('offers send before edit on a confirmed summons for staff', () => {
    expect(
      getAppealSummonsMenuItems(
        { confirmedDate: '2026-06-05T09:15:00.000Z' },
        mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ).map((item) => item.title),
    ).toEqual([
      'Senda til Landsréttar',
      'Breyta',
      'Opna í nýjum flipa',
      'Eyða',
    ])
  })

  it('hides edit and delete once the summons has been sent to the court of appeals', () => {
    expect(
      getAppealSummonsMenuItems(
        { sentToCourtOfAppealsDate: '2026-06-10T10:00:00.000Z' },
        mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF),
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ).map((item) => item.title),
    ).toEqual(['Opna í nýjum flipa'])
  })

  it('offers only open to a public prosecution prosecutor', () => {
    expect(
      getAppealSummonsMenuItems(
        {},
        publicProsecutorUser(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ).map((item) => item.title),
    ).toEqual(['Opna í nýjum flipa'])
  })

  it('offers only open to the court of appeals once sent', () => {
    expect(
      getAppealSummonsMenuItems(
        { sentToCourtOfAppealsDate: '2026-06-10T10:00:00.000Z' },
        mockUser(UserRole.COURT_OF_APPEALS_JUDGE),
        jest.fn(),
        jest.fn(),
        jest.fn(),
      ).map((item) => item.title),
    ).toEqual(['Opna í nýjum flipa'])
  })
})
