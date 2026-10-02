import {
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_RESULT_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getCourtOfAppealsRouteForRow } from './useCaseList.logic'

describe('getCourtOfAppealsRouteForRow', () => {
  // A case can carry every kind of appeal at once, so the case cannot say
  // which proceeding a row is about - only the appeal named in the url can.
  const caseWithEveryAppeal = {
    id: 'case-id',
    appealCase: {
      id: 'ruling-appeal',
      appealState: AppealCaseState.RECEIVED,
      appealType: AppealCaseType.RULING,
    },
    rulingOrderAppealCases: [
      {
        id: 'ruling-order-appeal',
        appealState: AppealCaseState.COMPLETED,
        appealType: AppealCaseType.RULING,
      },
    ],
    verdictAppealCase: {
      id: 'verdict-appeal',
      appealState: AppealCaseState.APPEALED,
      appealType: AppealCaseType.VERDICT,
    },
  } as unknown as WorkingCase

  it('opens the verdict appeal page for a verdict appeal', () => {
    expect(
      getCourtOfAppealsRouteForRow(caseWithEveryAppeal, 'verdict-appeal'),
    ).toBe(COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE)
  })

  // The same case, a different appeal: nothing about the case changed, so the
  // appeal is doing the deciding.
  it('opens the ruling appeal overview for the case level appeal', () => {
    expect(
      getCourtOfAppealsRouteForRow(caseWithEveryAppeal, 'ruling-appeal'),
    ).toBe(COURT_OF_APPEAL_OVERVIEW_ROUTE)
  })

  it('opens the result page for a completed ruling order appeal', () => {
    expect(
      getCourtOfAppealsRouteForRow(caseWithEveryAppeal, 'ruling-order-appeal'),
    ).toBe(COURT_OF_APPEAL_RESULT_ROUTE)
  })

  // A verdict appeal goes to its own page whatever state it is in - both of
  // the court's verdict lists open it.
  it.each([
    AppealCaseState.APPEALED,
    AppealCaseState.RECEIVED,
    AppealCaseState.COMPLETED,
    AppealCaseState.WITHDRAWN,
  ])('opens the verdict appeal page for a %s verdict appeal', (appealState) => {
    const theCase = {
      id: 'case-id',
      verdictAppealCase: {
        id: 'verdict-appeal',
        appealState,
        appealType: AppealCaseType.VERDICT,
      },
    } as unknown as WorkingCase

    expect(getCourtOfAppealsRouteForRow(theCase, 'verdict-appeal')).toBe(
      COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
    )
  })

  // Deep links and anything that names no appeal keep the behaviour they had
  // before verdict appeals existed.
  it('falls back to the ruling appeal overview when no appeal is named', () => {
    expect(getCourtOfAppealsRouteForRow(caseWithEveryAppeal)).toBe(
      COURT_OF_APPEAL_OVERVIEW_ROUTE,
    )
  })
})
