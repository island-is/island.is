import {
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_RESULT_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTableType } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import { getCourtOfAppealsRouteForRow } from './useCaseList.logic'

describe('getCourtOfAppealsRouteForRow', () => {
  const caseWithBothAppeals = {
    id: 'case-id',
    appealCase: { id: 'ruling-appeal', appealState: AppealCaseState.RECEIVED },
    verdictAppealCase: {
      id: 'verdict-appeal',
      appealState: AppealCaseState.RECEIVED,
    },
  } as unknown as WorkingCase

  // The two verdict lists both open the page written for them, whatever state
  // the appeal is in - unlike the ruling appeal lists, which split overview
  // from result.
  it.each([
    CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
    CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
  ])('sends a row from %s to the verdict appeal overview', (tableType) => {
    expect(
      getCourtOfAppealsRouteForRow(caseWithBothAppeals, null, tableType),
    ).toEqual({
      route: COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
      withAppealCaseId: false,
    })
  })

  // The case carries a verdict appeal too, so only the list it came from can
  // tell these apart. Getting this wrong would send a ruling appeal to the
  // verdict page and show the wrong proceeding.
  it('leaves the ruling appeal lists on their own pages', () => {
    expect(
      getCourtOfAppealsRouteForRow(
        caseWithBothAppeals,
        'ruling-appeal',
        CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
      ),
    ).toEqual({
      route: COURT_OF_APPEAL_OVERVIEW_ROUTE,
      withAppealCaseId: true,
    })
  })

  it('still sends a completed ruling appeal to the result page', () => {
    const completed = {
      id: 'case-id',
      appealCase: {
        id: 'ruling-appeal',
        appealState: AppealCaseState.COMPLETED,
      },
    } as unknown as WorkingCase

    expect(
      getCourtOfAppealsRouteForRow(
        completed,
        'ruling-appeal',
        CaseTableType.COURT_OF_APPEALS_CASES_COMPLETED,
      ),
    ).toEqual({
      route: COURT_OF_APPEAL_RESULT_ROUTE,
      withAppealCaseId: true,
    })
  })

  // Deep links and anything that does not know its list keep the behaviour
  // they had before the verdict lists existed.
  it('falls back to the ruling appeal overview with no table type', () => {
    expect(getCourtOfAppealsRouteForRow(caseWithBothAppeals)).toEqual({
      route: COURT_OF_APPEAL_OVERVIEW_ROUTE,
      withAppealCaseId: true,
    })
  })
})
