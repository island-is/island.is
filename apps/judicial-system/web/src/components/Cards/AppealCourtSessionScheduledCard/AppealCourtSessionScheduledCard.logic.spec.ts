import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  AppealCaseState,
  AppealCourtSessionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getScheduledAppealCourtSessions } from './AppealCourtSessionScheduledCard.logic'

describe('getScheduledAppealCourtSessions', () => {
  // A fixed clock, so the fixtures mean the same whenever this runs.
  const now = new Date(2026, 2, 10, 14, 0)

  const mainHearing = {
    id: 'main_hearing_id',
    sessionType: AppealCourtSessionType.MAIN_HEARING,
    sessionDate: new Date(2026, 4, 20, 9, 0).toISOString(),
    courtRoom: '1',
  }
  const preparatoryHearing = {
    id: 'preparatory_hearing_id',
    sessionType: AppealCourtSessionType.PREPARATORY_HEARING,
    sessionDate: new Date(2026, 3, 2, 13, 0).toISOString(),
    courtRoom: '2',
  }

  const appeal = (
    overrides: Partial<NonNullable<WorkingCase['verdictAppealCase']>> = {},
  ): WorkingCase['verdictAppealCase'] => ({
    id: 'verdict_appeal_id',
    appealState: AppealCaseState.RECEIVED,
    courtSessions: [mainHearing, preparatoryHearing],
    ...overrides,
  })

  it('lists every booked session ahead, earliest first', () => {
    expect(getScheduledAppealCourtSessions(appeal(), now)).toEqual([
      preparatoryHearing,
      mainHearing,
    ])
  })

  it('leaves out a session whose day has passed', () => {
    const held = {
      ...preparatoryHearing,
      sessionDate: new Date(2026, 2, 9, 13, 0).toISOString(),
    }

    expect(
      getScheduledAppealCourtSessions(
        appeal({ courtSessions: [mainHearing, held] }),
        now,
      ),
    ).toEqual([mainHearing])
  })

  it('leaves out a session the court has not finished booking', () => {
    expect(
      getScheduledAppealCourtSessions(
        appeal({
          courtSessions: [
            { ...mainHearing, sessionType: null },
            { ...preparatoryHearing, sessionDate: null },
          ],
        }),
        now,
      ),
    ).toEqual([])
  })

  it.each([AppealCaseState.COMPLETED, AppealCaseState.WITHDRAWN])(
    'has nothing on the agenda once the appeal is %s',
    (appealState) => {
      expect(
        getScheduledAppealCourtSessions(appeal({ appealState }), now),
      ).toEqual([])
    },
  )

  it('has nothing on the agenda without an appeal', () => {
    expect(getScheduledAppealCourtSessions(undefined, now)).toEqual([])
    expect(getScheduledAppealCourtSessions(null, now)).toEqual([])
  })
})
