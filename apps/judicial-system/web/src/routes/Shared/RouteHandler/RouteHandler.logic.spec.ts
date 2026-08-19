import { DEFENDER_INDICTMENT_CASE_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase, mockUser } from '@island.is/judicial-system-web/src/utils/mocks'

import { getRoute } from './RouteHandler.logic'

describe('getRoute', () => {
  test('routes a defender to the indictment case page', () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      id: 'merged-into-id',
      state: CaseState.COMPLETED,
    }

    expect(getRoute(theCase, mockUser(UserRole.DEFENDER))).toBe(
      `${DEFENDER_INDICTMENT_CASE_ROUTE}/merged-into-id`,
    )
  })

  test('routes a defender to the same indictment page for an ongoing case', () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      id: 'ongoing-id',
      state: CaseState.RECEIVED,
    }

    expect(getRoute(theCase, mockUser(UserRole.DEFENDER))).toBe(
      `${DEFENDER_INDICTMENT_CASE_ROUTE}/ongoing-id`,
    )
  })
})
