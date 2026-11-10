import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealEventType,
  CaseType,
  type User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getVerdictAppealOverviewBanner,
  getVerdictAppealOverviewConclusion,
} from './IndictmentOverview.logic'

const defender: User = {
  id: 'user_id',
  created: '2020-01-01',
  modified: '2020-01-01',
  nationalId: '1111111111',
  name: 'Verjandi',
  role: UserRole.DEFENDER,
  active: true,
}

const workingCase = (verdictAppealCase: {
  id: string
  appealState?: AppealCaseState
  appealRulingDate?: string
  appealRulingDecision?: AppealCaseRulingDecision
  appealConclusion?: string
  statementDeadlines?: {
    id: string
    defendantId?: string
    civilClaimantId?: string
    deadline: string
  }[]
  appealEventLogs?: {
    id: string
    created: string
    eventType: AppealEventType
    defendantId?: string
    civilClaimantId?: string
  }[]
}) => ({
  type: CaseType.INDICTMENT,
  defendants: [
    {
      id: 'defendant_id',
      isAppealDefenderConfirmed: true,
      appealDefenderNationalId: defender.nationalId,
    },
  ],
  civilClaimants: [],
  verdictAppealCase,
})

describe('getVerdictAppealOverviewBanner', () => {
  const now = new Date('2026-11-10T12:00:00.000Z')

  it('returns undefined when there is no verdict appeal', () => {
    expect(
      getVerdictAppealOverviewBanner(
        { type: CaseType.INDICTMENT, defendants: [], civilClaimants: [] },
        defender,
        now,
      ),
    ).toBeUndefined()
  })

  it('shows the statement deadline for the appeal advocate’s party', () => {
    expect(
      getVerdictAppealOverviewBanner(
        workingCase({
          id: 'appeal_id',
          appealState: AppealCaseState.RECEIVED,
          statementDeadlines: [
            {
              id: 'other_deadline',
              defendantId: 'other_defendant',
              deadline: '2026-11-20T15:00:00.000Z',
            },
            {
              id: 'own_deadline',
              defendantId: 'defendant_id',
              deadline: '2026-11-15T15:00:00.000Z',
            },
          ],
        }),
        defender,
        now,
      ),
    ).toEqual({
      title: 'Dómur áfrýjaður',
      description:
        'Frestur til að skila greinargerð rennur út 15. nóvember 2026 kl. 15:00',
      statementSentText: undefined,
    })
  })

  it('marks the deadline as expired when it has passed', () => {
    expect(
      getVerdictAppealOverviewBanner(
        workingCase({
          id: 'appeal_id',
          appealState: AppealCaseState.RECEIVED,
          statementDeadlines: [
            {
              id: 'own_deadline',
              defendantId: 'defendant_id',
              deadline: '2026-11-01T15:00:00.000Z',
            },
          ],
        }),
        defender,
        now,
      )?.description,
    ).toBe(
      'Frestur til að skila greinargerð rann út 1. nóvember 2026 kl. 15:00',
    )
  })

  it('notes when the party has already sent its statement', () => {
    expect(
      getVerdictAppealOverviewBanner(
        workingCase({
          id: 'appeal_id',
          appealState: AppealCaseState.RECEIVED,
          statementDeadlines: [
            {
              id: 'own_deadline',
              defendantId: 'defendant_id',
              deadline: '2026-11-15T15:00:00.000Z',
            },
          ],
          appealEventLogs: [
            {
              id: 'log_id',
              created: '2026-11-09T10:30:00.000Z',
              eventType: AppealEventType.APPEAL_STATEMENT_SENT,
              defendantId: 'defendant_id',
            },
          ],
        }),
        defender,
        now,
      )?.statementSentText,
    ).toBe('Greinargerð send 9. nóvember 2026 kl. 10:30')
  })

  it('returns undefined when the party has no statement deadline yet', () => {
    expect(
      getVerdictAppealOverviewBanner(
        workingCase({
          id: 'appeal_id',
          appealState: AppealCaseState.RECEIVED,
          statementDeadlines: [
            {
              id: 'other_deadline',
              defendantId: 'other_defendant',
              deadline: '2026-11-15T15:00:00.000Z',
            },
          ],
        }),
        defender,
        now,
      ),
    ).toBeUndefined()
  })

  it('does not treat an unmatched defender as the prosecution party', () => {
    expect(
      getVerdictAppealOverviewBanner(
        {
          type: CaseType.INDICTMENT,
          defendants: [
            {
              id: 'defendant_id',
              isAppealDefenderConfirmed: true,
              appealDefenderNationalId: '9999999999',
            },
          ],
          civilClaimants: [],
          verdictAppealCase: {
            id: 'appeal_id',
            appealState: AppealCaseState.RECEIVED,
            statementDeadlines: [
              {
                id: 'prosecution_deadline',
                deadline: '2026-11-15T15:00:00.000Z',
              },
            ],
          },
        },
        defender,
        now,
      ),
    ).toBeUndefined()
  })

  it('picks the earliest deadline when the defender represents several defendants', () => {
    expect(
      getVerdictAppealOverviewBanner(
        {
          type: CaseType.INDICTMENT,
          defendants: [
            {
              id: 'first_defendant',
              isDefenderChoiceConfirmed: true,
              defenderNationalId: defender.nationalId,
            },
            {
              id: 'second_defendant',
              isAppealDefenderConfirmed: true,
              appealDefenderNationalId: defender.nationalId,
            },
          ],
          civilClaimants: [],
          verdictAppealCase: {
            id: 'appeal_id',
            appealState: AppealCaseState.RECEIVED,
            statementDeadlines: [
              {
                id: 'later_deadline',
                defendantId: 'first_defendant',
                deadline: '2026-11-20T15:00:00.000Z',
              },
              {
                id: 'earlier_deadline',
                defendantId: 'second_defendant',
                deadline: '2026-11-12T15:00:00.000Z',
              },
            ],
          },
        },
        defender,
        now,
      ),
    ).toEqual({
      title: 'Dómur áfrýjaður',
      description:
        'Frestur til að skila greinargerð rennur út 12. nóvember 2026 kl. 15:00',
      statementSentText: undefined,
    })
  })

  it('considers civil-claimant deadlines alongside defendant ones', () => {
    expect(
      getVerdictAppealOverviewBanner(
        {
          type: CaseType.INDICTMENT,
          defendants: [
            {
              id: 'defendant_id',
              isAppealDefenderConfirmed: true,
              appealDefenderNationalId: defender.nationalId,
            },
          ],
          civilClaimants: [
            {
              id: 'claimant_id',
              hasSpokesperson: true,
              isSpokespersonConfirmed: true,
              spokespersonNationalId: defender.nationalId,
            },
          ],
          verdictAppealCase: {
            id: 'appeal_id',
            appealState: AppealCaseState.RECEIVED,
            statementDeadlines: [
              {
                id: 'defendant_deadline',
                defendantId: 'defendant_id',
                deadline: '2026-11-20T15:00:00.000Z',
              },
              {
                id: 'claimant_deadline',
                civilClaimantId: 'claimant_id',
                deadline: '2026-11-11T15:00:00.000Z',
              },
            ],
          },
        },
        defender,
        now,
      ),
    ).toEqual({
      title: 'Dómur áfrýjaður',
      description:
        'Frestur til að skila greinargerð rennur út 11. nóvember 2026 kl. 15:00',
      statementSentText: undefined,
    })
  })

  it('shows the completed Landsréttur outcome', () => {
    expect(
      getVerdictAppealOverviewBanner(
        workingCase({
          id: 'appeal_id',
          appealState: AppealCaseState.COMPLETED,
          appealRulingDate: '2026-12-01T12:00:00.000Z',
          appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
        }),
        defender,
        now,
      ),
    ).toEqual({
      title: 'Niðurstaða Landsréttar 1. desember 2026',
      appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    })
  })

  it('shows a withdrawn appeal', () => {
    expect(
      getVerdictAppealOverviewBanner(
        workingCase({
          id: 'appeal_id',
          appealState: AppealCaseState.WITHDRAWN,
        }),
        defender,
        now,
      ),
    ).toEqual({
      title: 'Dómur áfrýjaður',
      description: 'Afturkallað',
    })
  })
})

describe('getVerdictAppealOverviewConclusion', () => {
  it('returns the Landsréttur conclusion when present', () => {
    expect(
      getVerdictAppealOverviewConclusion({
        id: 'appeal_id',
        appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
      }),
    ).toEqual({
      title: 'Dómsorð Landsréttar',
      conclusionText: 'Hinn áfrýjaði dómur skal vera óraskaður.',
    })
  })

  it('returns undefined when there is no conclusion text', () => {
    expect(
      getVerdictAppealOverviewConclusion({ id: 'appeal_id' }),
    ).toBeUndefined()
  })
})
