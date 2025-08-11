import {
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { displayCaseType } from './utils'

describe('displayCaseType', () => {
  const formatMessage = createFormatMessage()
  const fn = (caseType: CaseType, decision?: CaseDecision) =>
    displayCaseType(formatMessage, caseType, decision)

  test('should display as travel ban when case descition is accepting alternative travel ban', () => {
    expect(
      fn(CaseType.CUSTODY, CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN),
    ).toBe('Farbann')
  })

  it.each([CaseType.INDICTMENT])(
    'should display indictment case: %s',
    (caseType) => {
      expect(fn(caseType)).toEqual('Ákæra')
    },
  )
})
