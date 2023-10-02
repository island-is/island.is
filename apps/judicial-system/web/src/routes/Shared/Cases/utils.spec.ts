import { createIntl } from 'react-intl'

import { CaseDecision } from '@island.is/judicial-system/types'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

import { displayCaseType } from './utils'

const formatMessage = createIntl({
  locale: 'is-IS',
  onError: jest.fn,
}).formatMessage

describe('displayCaseType', () => {
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
