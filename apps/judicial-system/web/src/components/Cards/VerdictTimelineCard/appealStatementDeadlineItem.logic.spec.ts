import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import { getOpenAppealStatementDeadlineItem } from './appealStatementDeadlineItem.logic'

describe('getOpenAppealStatementDeadlineItem', () => {
  const openCase = {
    appealState: AppealCaseState.RECEIVED,
    statementDeadlines: [
      {
        id: 'prosecution_deadline',
        deadline: '2026-09-14T00:00:00.000Z',
        isExpired: false,
      },
      {
        id: 'defendant_deadline',
        defendantId: 'defendant_id',
        deadline: '2026-09-20T00:00:00.000Z',
        isExpired: false,
      },
    ],
  }

  it('returns the prosecution deadline when no party is named', () => {
    expect(getOpenAppealStatementDeadlineItem(openCase, {})).toEqual({
      text: 'Frestur til að skila greinargerð er til 14.09.2026',
    })
  })

  it('returns the named defendant deadline', () => {
    expect(
      getOpenAppealStatementDeadlineItem(openCase, {
        defendantId: 'defendant_id',
      }),
    ).toEqual({
      text: 'Frestur til að skila greinargerð er til 20.09.2026',
    })
  })

  it('says the deadline has run out when isExpired is true', () => {
    expect(
      getOpenAppealStatementDeadlineItem(
        {
          appealState: AppealCaseState.RECEIVED,
          statementDeadlines: [
            {
              id: 'prosecution_deadline',
              deadline: '2026-09-14T00:00:00.000Z',
              isExpired: true,
            },
          ],
        },
        {},
      ),
    ).toEqual({
      text: 'Frestur til að skila greinargerð rann út 14.09.2026',
    })
  })

  it('is absent once the appeal is completed or withdrawn', () => {
    expect(
      getOpenAppealStatementDeadlineItem(
        { ...openCase, appealState: AppealCaseState.COMPLETED },
        {},
      ),
    ).toBeUndefined()
    expect(
      getOpenAppealStatementDeadlineItem(
        { ...openCase, appealState: AppealCaseState.WITHDRAWN },
        {},
      ),
    ).toBeUndefined()
  })

  it('is absent when the party has no deadline', () => {
    expect(
      getOpenAppealStatementDeadlineItem(openCase, {
        defendantId: 'other_defendant',
      }),
    ).toBeUndefined()
  })
})
