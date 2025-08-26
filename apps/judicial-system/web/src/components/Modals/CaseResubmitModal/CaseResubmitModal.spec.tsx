import {
  Case,
  RequestSharedWithDefender,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { getCaseResubmittedText } from './CaseResubmitModal'

describe('getCaseResubmittedText', () => {
  const formatMessage = createFormatMessage()
  const fn = (theCase: Case) => getCaseResubmittedText(formatMessage, theCase)

  test('should format correctly when court date has been set and defender is set to receive access when the court date is set', () => {
    const theCase = {
      id: 'abc',
      requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
      arraignmentDate: { date: '2022-06-13T13:37:00Z' },
    } as Case

    const res = fn(theCase)

    expect(res).toEqual(
      'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur. Bæði dómari og verjandi munu fá tilkynningu um að krafa hafi verið send aftur.',
    )
  })

  it.each`
    id       | arraignmentDate                     | requestSharedWithDefender
    ${'abc'} | ${undefined}                        | ${RequestSharedWithDefender.COURT_DATE}
    ${'abc'} | ${{ date: '2022-06-13T13:37:00Z' }} | ${undefined}
    ${'abc'} | ${undefined}                        | ${undefined}
  `(
    'should not include section about notification',
    ({ id, arraignmentDate, requestSharedWithDefender }) => {
      const theCase = { id, arraignmentDate, requestSharedWithDefender } as Case

      const res = fn(theCase)

      expect(res).toEqual(
        'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur.',
      )
    },
  )
})
