import {
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseGender,
} from '@island.is/judicial-system/types'

import {
  formatConclusion,
  formatCourtCaseNumber,
  formatProsecutorCourtDateEmailNotification,
  formatCourtDateNotificationCondition,
  formatCustodyProvisions,
  formatHeadsUpSmsNotification,
  formatProsecutorDemands,
  formatReadyForCourtSmsNotification,
  formatRestrictions,
  formatPrisonCourtDateEmailNotification,
  stripHtmlTags,
  formatDefenderCourtDateEmailNotification,
} from './formatters'

describe('formatProsecutorDemands', () => {
  test('should format prosecutor demands with isolation', () => {
    // Arrange
    const accusedNationalId = '010101-0000'
    const accusedName = 'Glanni Glæpur'
    const court = 'Héraðsdómur Reykjavíkur'
    const requestedCustodyEndDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = true

    // Act
    const res = formatProsecutorDemands(
      accusedNationalId,
      accusedName,
      court,
      requestedCustodyEndDate,
      isolation,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Glanni Glæpur 010101-0000 verði með úrskurði Héraðsdóms Reykjavíkur gert að sæta gæsluvarðhaldi til mánudagsins 16. nóvember 2020 kl. 19:30 og verði gert að sæta einangrun meðan á gæsluvarðhaldi stendur.',
    )
  })

  test('should format prosecutor demands without isolation', () => {
    // Arrange
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const court = 'Héraðsdómur Reykjavíkur'
    const requestedCustodyEndDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = false

    // Act
    const res = formatProsecutorDemands(
      accusedNationalId,
      accusedName,
      court,
      requestedCustodyEndDate,
      isolation,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Glanni Glæpur 010101-0000 verði með úrskurði Héraðsdóms Reykjavíkur gert að sæta gæsluvarðhaldi til mánudagsins 16. nóvember 2020 kl. 19:30.',
    )
  })
})

describe('formatCustodyProvisions', () => {
  test('should format custody provisions when no provisions are selected', () => {
    // Arrange
    const custodyProvisions = []

    // Act
    const res = formatCustodyProvisions(custodyProvisions)

    // Assert
    expect(res).toBe('')
  })

  test('should format custody provisions when some provisions are selected', () => {
    // Arrange
    const custodyProvisions = [
      CaseCustodyProvisions._95_1_A,
      CaseCustodyProvisions._95_1_B,
      CaseCustodyProvisions._95_1_C,
      CaseCustodyProvisions._95_1_D,
      CaseCustodyProvisions._95_2,
      CaseCustodyProvisions._99_1_B,
    ]

    // Act
    const res = formatCustodyProvisions(custodyProvisions)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr.\nb-lið 1. mgr. 95. gr.\nc-lið 1. mgr. 95. gr.\nd-lið 1. mgr. 95. gr.\n2. mgr. 95. gr.\nb-lið 1. mgr. 99. gr.',
    )
  })

  test('should sort provisions when formatting custody provisions', () => {
    // Arrange
    const custodyProvisions = [
      CaseCustodyProvisions._95_1_C,
      CaseCustodyProvisions._95_1_D,
      CaseCustodyProvisions._95_1_A,
      CaseCustodyProvisions._95_2,
      CaseCustodyProvisions._99_1_B,
      CaseCustodyProvisions._95_1_B,
    ]

    // Act
    const res = formatCustodyProvisions(custodyProvisions)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr.\nb-lið 1. mgr. 95. gr.\nc-lið 1. mgr. 95. gr.\nd-lið 1. mgr. 95. gr.\n2. mgr. 95. gr.\nb-lið 1. mgr. 99. gr.',
    )
  })
})

describe('formatCourtCaseNumber', () => {
  test('should return formatted court case number', () => {
    // Arrange
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-5/2020'

    // Act
    const res = formatCourtCaseNumber(court, courtCaseNumber)

    // Assert
    expect(res).toBe('Málsnúmer Héraðsdóms Reykjavíkur R-5/2020')
  })
})

describe('formatConclusion', () => {
  test('should format conclusion for a rejected case', () => {
    // Arrange
    const rejecting = true

    // Act
    const res = formatConclusion(
      undefined,
      undefined,
      rejecting,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe('Beiðni um gæsluvarðhald hafnað.')
  })

  test('should format conclusion for an accepted case without isolation', () => {
    // Arrange
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const rejecting = false
    const custodyEndDate = new Date('2020-12-22T11:23')
    const isolation = false

    // Act
    const res = formatConclusion(
      accusedNationalId,
      accusedName,
      rejecting,
      custodyEndDate,
      isolation,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur 010101-0000 skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020 kl. 11:23.',
    )
  })

  test('should format conclusion for an accepted case with isolation', () => {
    // Arrange
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const rejecting = false
    const custodyEndDate = new Date('2020-12-22T11:23')
    const isolation = true

    // Act
    const res = formatConclusion(
      accusedNationalId,
      accusedName,
      rejecting,
      custodyEndDate,
      isolation,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur 010101-0000 skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020 kl. 11:23. Kærði skal sæta einangrun meðan á gæsluvarðhaldi stendur.',
    )
  })
})

describe('formatRestrictions', () => {
  test('should return formatted restrictions for no restrictions', () => {
    // Arrange
    const custodyRestrictions = []

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe('Sækjandi tekur fram að gæsluvarðhaldið sé án takmarkana.')
  })

  test('should return formatted restrictions for isolation only', () => {
    // Arrange
    const custodyRestrictions = [CaseCustodyRestrictions.ISOLATION]

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að kærði skuli sæta einangrun meðan á gæsluvarðhaldi stendur.',
    )
  })

  test('should return formatted restrictions for isolation and one other restriction', () => {
    // Arrange
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að kærði skuli sæta einangrun meðan á gæsluvarðhaldi stendur og að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should return formatted restrictions for all but isolation', () => {
    // Arrange
    const custodyRestrictions = [
      CaseCustodyRestrictions.COMMUNICATION,
      CaseCustodyRestrictions.MEDIA,
      CaseCustodyRestrictions.VISITAION,
    ]

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með bréfaskoðun og símabanni, fjölmiðlabanni og heimsóknarbanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should order non-isolation restrictions', () => {
    // Arrange
    const custodyRestrictions = [
      CaseCustodyRestrictions.MEDIA,
      CaseCustodyRestrictions.VISITAION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með bréfaskoðun og símabanni, fjölmiðlabanni og heimsóknarbanni skv. 99. gr. laga nr. 88/2008.',
    )
  })
})

describe('formatHeadsUpSmsNotification', () => {
  test('should format heads up notification', () => {
    // Arrange
    const prosecutorName = 'Árni Ákærandi'
    const arrestDate = new Date('2020-11-24T13:22')
    const requestedCourtDate = new Date('2020-11-25T09:15')

    // Act
    const res = formatHeadsUpSmsNotification(
      prosecutorName,
      arrestDate,
      requestedCourtDate,
    )

    // Assert
    expect(res).toBe(
      'Ný gæsluvarðhaldskrafa í vinnslu. Ákærandi: Árni Ákærandi. Viðkomandi handtekinn 24.11.2020 kl. 13:22. ÓE fyrirtöku 25.11.2020 eftir kl. 09:15.',
    )
  })

  test('should format heads up notification with missing dates', () => {
    // Arrange
    const prosecutorName = 'Árni Ákærandi'

    // Act
    const res = formatHeadsUpSmsNotification(
      prosecutorName,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Ný gæsluvarðhaldskrafa í vinnslu. Ákærandi: Árni Ákærandi.',
    )
  })
})

describe('formatReadyForCourtSmsNotification', () => {
  test('should format ready for court SMS notification', () => {
    // Arrange
    const prosecutorName = 'Árni Ákærandi'
    const court = 'Héraðsdómur Reykjavíkur'

    // Act
    const res = formatReadyForCourtSmsNotification(prosecutorName, court)

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Ákærandi: Árni Ákærandi. Dómstóll: Héraðsdómur Reykjavíkur.',
    )
  })
})

describe('formatProsecutorCourtDateEmailNotification', () => {
  test('should format court date notification', () => {
    // Arrange
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = '101'
    const defenderName = 'Valdi Verjandi'

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      court,
      courtDate,
      courtRoom,
      defenderName,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram 24. desember 2020 kl. 18:00.<br /><br />Dómsalur: 101.<br /><br />Verjandi sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification with no defender', () => {
    // Arrange
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = '101'

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      court,
      courtDate,
      courtRoom,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram 24. desember 2020 kl. 18:00.<br /><br />Dómsalur: 101.<br /><br />Verjandi sakbornings hefur ekki verið skráður.',
    )
  })
})

describe('formatPrisonCourtDateEmailNotification', () => {
  test('should format court date notification', () => {
    // Arrange
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = CaseGender.FEMALE
    const requestedCustodyEndDate = new Date('2030-08-12T08:25')
    const isolation = true
    const defenderName = 'Varði Varnari'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      court,
      courtDate,
      accusedGender,
      requestedCustodyEndDate,
      isolation,
      defenderName,
    )

    // Assert
    expect(res).toBe(
      'Krafa um gæsluvarðhald hefur verið send til Héraðsdóms Austurlands og verður málið tekið fyrir 4. febrúar 2021 kl. 02:02.<br /><br />Sakborningur er kona og krafist er gæsluvarðhalds til 12. ágúst 2030 kl. 08:25.<br /><br />Farið er fram á einangrun.<br /><br />Verjandi sakbornings: Varði Varnari.',
    )
  })

  test('should format court date notification with unknown gender', () => {
    // Arrange
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = CaseGender.OTHER
    const requestedCustodyEndDate = new Date('2030-08-12T08:25')
    const isolation = true
    const defenderName = 'Vala Verja'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      court,
      courtDate,
      accusedGender,
      requestedCustodyEndDate,
      isolation,
      defenderName,
    )

    // Assert
    expect(res).toBe(
      'Krafa um gæsluvarðhald hefur verið send til Héraðsdóms Austurlands og verður málið tekið fyrir 4. febrúar 2021 kl. 02:02.<br /><br />Krafist er gæsluvarðhalds til 12. ágúst 2030 kl. 08:25.<br /><br />Farið er fram á einangrun.<br /><br />Verjandi sakbornings: Vala Verja.',
    )
  })

  test('should format court date notification with no isolation', () => {
    // Arrange
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = CaseGender.MALE
    const requestedCustodyEndDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = 'Vala Verja'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      court,
      courtDate,
      accusedGender,
      requestedCustodyEndDate,
      isolation,
      defenderName,
    )

    // Assert
    expect(res).toBe(
      'Krafa um gæsluvarðhald hefur verið send til Héraðsdóms Austurlands og verður málið tekið fyrir 4. febrúar 2021 kl. 02:02.<br /><br />Sakborningur er karl og krafist er gæsluvarðhalds til 12. ágúst 2030 kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Verjandi sakbornings: Vala Verja.',
    )
  })

  test('should format court date notification with no defender', () => {
    // Arrange
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = CaseGender.MALE
    const requestedCustodyEndDate = new Date('2030-08-12T08:25')
    const isolation = false

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      court,
      courtDate,
      accusedGender,
      requestedCustodyEndDate,
      isolation,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Krafa um gæsluvarðhald hefur verið send til Héraðsdóms Austurlands og verður málið tekið fyrir 4. febrúar 2021 kl. 02:02.<br /><br />Sakborningur er karl og krafist er gæsluvarðhalds til 12. ágúst 2030 kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Verjandi sakbornings hefur ekki verið skráður.',
    )
  })
})

describe('formatDefenderCourtDateEmailNotification', () => {
  test('should format court date notification', () => {
    // Arrange
    const accusedNationalId = '1212129999'
    const accusedName = 'Robbi Ræningi'
    const court = 'Héraðsdómur Norðurlands'
    const courtDate = new Date('2020-12-19T10:19')
    const courtRoom = '101'

    // Act
    const res = formatDefenderCourtDateEmailNotification(
      accusedNationalId,
      accusedName,
      court,
      courtDate,
      courtRoom,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram 19. desember 2020 kl. 10:19.<br /><br />Dómsalur: 101.<br /><br />Sakborningur: Robbi Ræningi 121212-9999.<br /><br />Dómstóllinn hefur skráð þig sem verjanda sakbornings.',
    )
  })
})

describe('formatCourtDateNotificationCondition', () => {
  test('should format court date notification condition', () => {
    // Arrange
    const courtDate = new Date('2020-12-20T13:32')
    const defenderEmail = 'defender@defenders.is'

    // Act
    const res = formatCourtDateNotificationCondition(courtDate, defenderEmail)

    // Assert
    expect(res).toBe(
      'courtDate=20.12.2020 13:32,defenderEmail=defender@defenders.is',
    )
  })
})

describe('stripHtmlTags', () => {
  test('should format court date notification condition', () => {
    // Arrange
    const html = 'blablabla<br /><br />blabla'

    // Act
    const res = stripHtmlTags(html)

    // Assert
    expect(res).toBe('blablabla\n\nblabla')
  })
})
