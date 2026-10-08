import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type { AppealEventLog } from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealEventType } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getVerdictAppealOverviewHeaderLines,
  getVerdictAppealReceivedDate,
} from './VerdictAppealOverview.logic'

type HeaderCase = Pick<
  WorkingCase,
  'courtCaseNumber' | 'rulingDate' | 'verdictAppealCase'
>

const appealedAt = (created: string): AppealEventLog =>
  ({ eventType: AppealEventType.APPEALED, created } as AppealEventLog)

describe('getVerdictAppealReceivedDate', () => {
  it('finds nothing when there is no appeal yet', () => {
    expect(
      getVerdictAppealReceivedDate({ verdictAppealCase: null } as HeaderCase),
    ).toBeUndefined()
  })

  // The proceeding began when the first party appealed, so a second defendant
  // appealing later does not move the date the court is shown.
  it('takes the earliest registered appeal', () => {
    expect(
      getVerdictAppealReceivedDate({
        verdictAppealCase: {
          appealEventLogs: [
            appealedAt('2026-09-11T08:00:00.000Z'),
            appealedAt('2026-09-09T10:05:24.576Z'),
          ],
        },
      } as HeaderCase),
    ).toBe('2026-09-09T10:05:24.576Z')
  })

  it('ignores events that are not an appeal', () => {
    expect(
      getVerdictAppealReceivedDate({
        verdictAppealCase: {
          appealEventLogs: [
            {
              eventType: AppealEventType.APPEAL_STATEMENT_SENT,
              created: '2026-09-01T08:00:00.000Z',
            } as AppealEventLog,
            appealedAt('2026-09-09T10:05:24.576Z'),
          ],
        },
      } as HeaderCase),
    ).toBe('2026-09-09T10:05:24.576Z')
  })
})

describe('getVerdictAppealOverviewHeaderLines', () => {
  it('names the case, the ruling and the arrival of the appeal', () => {
    expect(
      getVerdictAppealOverviewHeaderLines({
        courtCaseNumber: 'S-14/2026',
        rulingDate: '2026-03-10T17:25:24.000Z',
        verdictAppealCase: {
          appealEventLogs: [appealedAt('2026-09-09T10:05:24.576Z')],
        },
      } as HeaderCase),
    ).toEqual([
      'Héraðsdómsmál S-14/2026',
      'Dómsuppkvaðning 10. mars 2026',
      'Áfrýjun barst Landsrétti 9. september 2026',
    ])
  })

  // The page opens on an appeal that has barely begun as readily as on a
  // finished one, so a line with nothing behind it is left out rather than
  // rendered with a blank date.
  it('leaves out what is not known', () => {
    expect(
      getVerdictAppealOverviewHeaderLines({
        courtCaseNumber: 'S-14/2026',
        rulingDate: null,
        verdictAppealCase: null,
      } as HeaderCase),
    ).toEqual(['Héraðsdómsmál S-14/2026'])
  })
})
