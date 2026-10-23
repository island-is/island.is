import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

import { getCaseDefenderFallback } from './useInfoCardItems.logic'

const caseDefender = {
  defenderName: 'Jón Lögmaður',
  defenderEmail: 'jon@logmenn.is',
  defenderPhoneNumber: '555-1234',
}

describe('getCaseDefenderFallback', () => {
  test.each([CaseType.CUSTODY, CaseType.SEARCH_WARRANT])(
    'does not fall back to the case defender for a %s case',
    (type) => {
      expect(getCaseDefenderFallback({ type, ...caseDefender })).toEqual({})
    },
  )

  test('falls back to the case defender for an indictment', () => {
    expect(
      getCaseDefenderFallback({ type: CaseType.INDICTMENT, ...caseDefender }),
    ).toEqual({
      name: 'Jón Lögmaður',
      email: 'jon@logmenn.is',
      phoneNumber: '555-1234',
    })
  })
})
