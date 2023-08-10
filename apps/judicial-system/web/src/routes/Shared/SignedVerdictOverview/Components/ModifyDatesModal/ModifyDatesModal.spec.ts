import { createIntl } from 'react-intl'

import { createCaseModifiedExplanation } from './ModifyDatesModal'

describe('createCaseModifiedExplanation', () => {
  const formatMessage = createIntl({
    locale: 'is',
    onError: jest.fn(),
  }).formatMessage
  beforeAll(() => jest.useFakeTimers())

  it('should append nextExplainantion', () => {
    const previousExplaination =
      'Föstud. 10. júní 2022 kl. 10:29 - Test Testsen Dómari, Héraðsdómur Reykjavíkur<br/>Ástæða: Testing'
    const nextExplainantion = 'Testing2'
    const userName = 'Test Testsen'
    const userTitle = 'Dómari'
    const institutionName = 'Héraðsdómur Reykjavíkur'

    jest.setSystemTime(new Date('2022-06-13T13:37:00Z'))

    const res = createCaseModifiedExplanation(
      formatMessage,
      previousExplaination,
      nextExplainantion,
      userName,
      userTitle,
      institutionName,
    )

    expect(res).toEqual(
      'Föstud. 10. júní 2022 kl. 10:29 - Test Testsen Dómari, Héraðsdómur Reykjavíkur<br/>Ástæða: Testing<br/><br/>Mánud. 13. júní 2022 kl. 13:37 - Test Testsen Dómari, Héraðsdómur Reykjavíkur<br/>Ástæða: Testing2',
    )
  })

  it('should format correctly without previousExplaination', () => {
    const previousExplaination = undefined
    const nextExplainantion = 'Testing'
    const userName = 'Test Testsen'
    const userTitle = 'Dómari'
    const institutionName = 'Héraðsdómur Reykjavíkur'

    jest.setSystemTime(new Date('2022-06-13T13:37:00Z'))

    const res = createCaseModifiedExplanation(
      formatMessage,
      previousExplaination,
      nextExplainantion,
      userName,
      userTitle,
      institutionName,
    )

    expect(res).toEqual(
      'Mánud. 13. júní 2022 kl. 13:37 - Test Testsen Dómari, Héraðsdómur Reykjavíkur<br/>Ástæða: Testing',
    )
  })
})
