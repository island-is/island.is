import { createIntl } from 'react-intl'

import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { getCaseResubmittedText } from './CaseResubmitModal'

describe('getCaseResubmittedText', () => {
  const formatMessage = createIntl({ locale: 'is', onError: jest.fn() })
    .formatMessage

  const fn = (theCase: Case) => getCaseResubmittedText(formatMessage, theCase)

  test('should format correctly when court date has been set and sendRequestToDefender=true', () => {
    const theCase = {
      courtDate: '2022-06-13T13:37:00Z',
      sendRequestToDefender: true,
    } as Case

    const res = fn(theCase)

    expect(res).toEqual(
      'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur. Bæði dómari og verjandi munu fá tilkynningu um að krafa hafi verið send aftur.',
    )
  })

  it.each`
    courtDate                 | sendRequestToDefender
    ${undefined}              | ${true}
    ${'2022-06-13T13:37:00Z'} | ${false}
    ${undefined}              | ${false}
  `(
    'should not include section about notification',
    ({ courtDate, sendRequestToDefender }) => {
      const theCase = { courtDate, sendRequestToDefender } as Case

      const res = fn(theCase)

      expect(res).toEqual(
        'Hér er hægt að senda skilaboð til dómstólsins með upplýsingum um hverju var breytt eða bætt við kröfuna áður en hún er send aftur.',
      )
    },
  )
})
