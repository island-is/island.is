import { createIntl } from 'react-intl'

import { RequestSharedWithDefender } from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { getCaseResubmittedText } from './CaseResubmitModal'

describe('getCaseResubmittedText', () => {
  const formatMessage = createIntl({
    locale: 'is',
    onError: jest.fn(),
  }).formatMessage

  const fn = (theCase: Case) => getCaseResubmittedText(formatMessage, theCase)

  test('should format correctly when court date has been set and defender is set to receive access when the court date is set', () => {
    const theCase = {
      courtDate: '2022-06-13T13:37:00Z',
      requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
    } as Case

    const res = fn(theCase)

    expect(res).toEqual(
      'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur. Bæði dómari og verjandi munu fá tilkynningu um að krafa hafi verið send aftur.',
    )
  })

  it.each`
    courtDate                 | requestSharedWithDefender
    ${undefined}              | ${RequestSharedWithDefender.COURT_DATE}
    ${'2022-06-13T13:37:00Z'} | ${undefined}
    ${undefined}              | ${undefined}
  `(
    'should not include section about notification',
    ({ courtDate, requestSharedWithDefender }) => {
      const theCase = { courtDate, requestSharedWithDefender } as Case

      const res = fn(theCase)

      expect(res).toEqual(
        'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur.',
      )
    },
  )
})
