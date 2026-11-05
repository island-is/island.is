import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  AppealCaseState,
  AppealCourtSessionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getBookedAppealCourtSessions } from './AppealCourtSessionScheduledCard.logic'

describe('getBookedAppealCourtSessions', () => {
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
  // Long since held.
  const held = {
    id: 'held_id',
    sessionType: AppealCourtSessionType.PREPARATORY_HEARING,
    sessionDate: new Date(2020, 0, 9, 13, 0).toISOString(),
    courtRoom: '3',
  }

  const appeal = (
    overrides: Partial<NonNullable<WorkingCase['verdictAppealCase']>> = {},
  ): WorkingCase['verdictAppealCase'] => ({
    id: 'verdict_appeal_id',
    appealState: AppealCaseState.RECEIVED,
    courtSessions: [mainHearing, held, preparatoryHearing],
    ...overrides,
  })

  // The backend hands the sessions over most recently booked first, the order
  // the court's own list shows them in, and the card keeps it.
  it('lists every booked session in the order given, held ones included', () => {
    expect(getBookedAppealCourtSessions(appeal())).toEqual([
      mainHearing,
      held,
      preparatoryHearing,
    ])
  })

  it.each([AppealCaseState.COMPLETED, AppealCaseState.WITHDRAWN])(
    'keeps the log once the appeal is %s',
    (appealState) => {
      expect(getBookedAppealCourtSessions(appeal({ appealState }))).toEqual([
        mainHearing,
        held,
        preparatoryHearing,
      ])
    },
  )

  it('leaves out a session the court has not finished booking', () => {
    expect(
      getBookedAppealCourtSessions(
        appeal({
          courtSessions: [
            { ...mainHearing, sessionType: null },
            { ...preparatoryHearing, sessionDate: null },
          ],
        }),
      ),
    ).toEqual([])
  })

  it('lists nothing without an appeal', () => {
    expect(getBookedAppealCourtSessions(undefined)).toEqual([])
    expect(getBookedAppealCourtSessions(null)).toEqual([])
  })
})
