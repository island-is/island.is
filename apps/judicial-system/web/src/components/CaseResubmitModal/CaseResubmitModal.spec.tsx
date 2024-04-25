import { createIntl } from 'react-intl'

import {
  DateType,
  RequestSharedWithDefender,
} from '@island.is/judicial-system-web/src/graphql/schema'
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
      id: 'abc',
      requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
      dateLogs: [
        {
          caseId: 'abc',
          created: '2022-06-13',
          date: '2022-06-13T13:37:00Z',
          dateType: DateType.ARRAIGNMENT_DATE,
        },
      ],
    } as Case

    const res = fn(theCase)

    expect(res).toEqual(
      'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur. Bæði dómari og verjandi munu fá tilkynningu um að krafa hafi verið send aftur.',
    )
  })

  it.each`
    id       | dateLogs     | requestSharedWithDefender
    ${'abc'} | ${undefined} | ${RequestSharedWithDefender.COURT_DATE}
    ${'abc'} | ${[{
    caseId: 'abc',
    date: '2022-06-13T13:37:00Z',
    created: '2022-06-13',
    dateType: DateType.ARRAIGNMENT_DATE,
  }]} | ${undefined}
    ${'abc'} | ${undefined} | ${undefined}
  `(
    'should not include section about notification',
    ({ id, dateLogs, requestSharedWithDefender }) => {
      const theCase = { id, dateLogs, requestSharedWithDefender } as Case

      const res = fn(theCase)

      expect(res).toEqual(
        'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur.',
      )
    },
  )
})
