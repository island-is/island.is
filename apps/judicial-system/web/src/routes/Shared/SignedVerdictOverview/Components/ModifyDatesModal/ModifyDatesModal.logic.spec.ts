import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { createCaseModifiedExplanation } from './ModifyDatesModal.logic'

describe('createCaseModifiedExplanation', () => {
  const formatMessage = createFormatMessage()

  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('should append nextExplainantion', () => {
    const previousExplanation =
      'Föstud. 10. júní 2022 kl. 10:29 - Test Testsen dómari, Héraðsdómur Reykjavíkur<br/>Ástæða: Testing'
    const nextExplainantion = 'Testing2'
    const userName = 'Test Testsen'
    const userTitle = 'Dómari'
    const institutionName = 'Héraðsdómur Reykjavíkur'

    jest.setSystemTime(new Date('2022-06-13T13:37:00Z'))

    const res = createCaseModifiedExplanation(
      formatMessage,
      previousExplanation,
      nextExplainantion,
      userName,
      userTitle,
      institutionName,
    )

    expect(res).toEqual(
      'Föstud. 10. júní 2022 kl. 10:29 - Test Testsen dómari, Héraðsdómur Reykjavíkur<br/>Ástæða: Testing<br/><br/>Mánud. 13. júní 2022 kl. 13:37 - Test Testsen dómari, Héraðsdómur Reykjavíkur<br/>Ástæða: Testing2',
    )
  })

  it('should format correctly without previousExplanation', () => {
    const previousExplanation = undefined
    const nextExplainantion = 'Testing'
    const userName = 'Test Testsen'
    const userTitle = 'Dómari'
    const institutionName = 'Héraðsdómur Reykjavíkur'

    jest.setSystemTime(new Date('2022-06-13T13:37:00Z'))

    const res = createCaseModifiedExplanation(
      formatMessage,
      previousExplanation,
      nextExplainantion,
      userName,
      userTitle,
      institutionName,
    )

    expect(res).toEqual(
      'Mánud. 13. júní 2022 kl. 13:37 - Test Testsen dómari, Héraðsdómur Reykjavíkur<br/>Ástæða: Testing',
    )
  })
})
