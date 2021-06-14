import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseType,
} from '@island.is/judicial-system/types'

import {
  formatConclusion,
  formatProsecutorCourtDateEmailNotification,
  formatCourtDateNotificationCondition,
  formatCustodyProvisions,
  formatCourtHeadsUpSmsNotification,
  formatCourtReadyForCourtSmsNotification,
  formatPrisonCourtDateEmailNotification,
  stripHtmlTags,
  formatDefenderCourtDateEmailNotification,
  formatPrisonRulingEmailNotification,
  formatCourtRevokedSmsNotification,
  formatPrisonRevokedEmailNotification,
  formatDefenderRevokedEmailNotification,
} from './formatters'

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
      CaseCustodyProvisions._100_1,
    ]

    // Act
    const res = formatCustodyProvisions(custodyProvisions)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr.\nb-lið 1. mgr. 95. gr.\nc-lið 1. mgr. 95. gr.\nd-lið 1. mgr. 95. gr.\n2. mgr. 95. gr.\nb-lið 1. mgr. 99. gr.\n1. mgr. 100. gr. sml.',
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
      CaseCustodyProvisions._100_1,
    ]

    // Act
    const res = formatCustodyProvisions(custodyProvisions)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr.\nb-lið 1. mgr. 95. gr.\nc-lið 1. mgr. 95. gr.\nd-lið 1. mgr. 95. gr.\n2. mgr. 95. gr.\nb-lið 1. mgr. 99. gr.\n1. mgr. 100. gr. sml.',
    )
  })
})

describe('formatConclusion', () => {
  test('should format conclusion for a rejected case', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.REJECTING
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      undefined,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  test('should format conclusion for an accepted case without isolation', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  test('should format conclusion for an accepted case with isolation', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = true
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
    )
  })

  test('should format conclusion for an accepted case with isolation and the isolation ends before the custody does', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = true
    const isExtension = false
    const isolationToDate = new Date('2020-12-20T15:39')

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
      isolationToDate,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun ekki lengur en til sunnudagsins 20. desember 2020, kl. 15:39.',
    )
  })

  test('should format conclusion for a case where custody is rejected, but alternative travel ban accepted', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    const validToDate = new Date('2021-01-29T13:03')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til föstudagsins 29. janúar 2021, kl. 13:03.',
    )
  })

  test('should format conclusion for rejected extension', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.REJECTING
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      undefined,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti áframhaldandi gæsluvarðhaldi er hafnað.',
    )
  })

  test('should format conclusion for rejected extension when previous ruling was travel ban', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.REJECTING
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      undefined,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  test('should format conclusion for accepted extension', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta áframhaldandi gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  test('should format conclusion for accepted extension when previous ruling was travel ban', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  test('should format conclusion for rejected extension when alternative travel ban accepted', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  test('should format conclusion for rejected extension when alternative travel ban accepted and previous ruling was travel ban', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta áframhaldandi farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })
  test('should format conclusion for a rejected travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.REJECTING
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      undefined,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti farbanni er hafnað.',
    )
  })

  test('should format conclusion for an accepted case without isolation', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })
})

describe('formatHeadsUpSmsNotification', () => {
  test('should format heads up notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Árni Ákærandi'
    const arrestDate = new Date('2020-11-24T13:22')
    const requestedCourtDate = new Date('2020-11-25T09:15')

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      type,
      prosecutorName,
      arrestDate,
      requestedCourtDate,
    )

    // Assert
    expect(res).toBe(
      'Ný gæsluvarðhaldskrafa í vinnslu. Ákærandi: Árni Ákærandi. Viðkomandi handtekinn 24.11.2020, kl. 13:22. ÓE fyrirtöku 25.11.2020, eftir kl. 09:15.',
    )
  })

  test('should format heads up notification with missing dates', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Árni Ákærandi'

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      type,
      prosecutorName,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Ný gæsluvarðhaldskrafa í vinnslu. Ákærandi: Árni Ákærandi.',
    )
  })

  test('should format heads up notification with missing prosecutor', () => {
    // Arrange
    const type = CaseType.CUSTODY

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      type,
      undefined,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Ný gæsluvarðhaldskrafa í vinnslu. Ákærandi: Ekki skráður.',
    )
  })

  test('should format heads up notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const prosecutorName = 'Ákærandinn'
    const arrestDate = new Date('2021-01-24T13:00')
    const requestedCourtDate = new Date('2021-01-25T19:15')

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      type,
      prosecutorName,
      arrestDate,
      requestedCourtDate,
    )

    // Assert
    expect(res).toBe(
      'Ný farbannskrafa í vinnslu. Ákærandi: Ákærandinn. Viðkomandi handtekinn 24.01.2021, kl. 13:00. ÓE fyrirtöku 25.01.2021, eftir kl. 19:15.',
    )
  })

  test('should format heads up notification for investigation', () => {
    // Arrange
    const type = CaseType.BODY_SEARCH
    const prosecutorName = 'Al Coe'
    const arrestDate = new Date('2021-01-24T13:00')
    const requestedCourtDate = new Date('2021-06-20T10:00')
    const description = 'Leit í bifreið'

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      type,
      prosecutorName,
      arrestDate,
      requestedCourtDate,
      description,
    )

    // Assert
    expect(res).toBe(
      'Ný krafa um rannsóknarheimild í vinnslu: Leit og líkamsrannsókn - Leit í bifreið. Ákærandi: Al Coe. Viðkomandi handtekinn 24.01.2021, kl. 13:00. ÓE fyrirtöku 20.06.2021, eftir kl. 10:00.',
    )
  })
})

describe('formatReadyForCourtSmsNotification', () => {
  test('should format ready for court SMS notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Árni Ákærandi'
    const court = 'Héraðsdómur Reykjavíkur'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      type,
      prosecutorName,
      court,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Ákærandi: Árni Ákærandi. Dómstóll: Héraðsdómur Reykjavíkur.',
    )
  })

  test('should format ready for court SMS notification with missing prosecutor and court', () => {
    // Arrange
    const type = CaseType.CUSTODY

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      type,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Ákærandi: Ekki skráður. Dómstóll: Ekki skráður.',
    )
  })

  test('should format ready for court SMS notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const prosecutorName = 'Árni Ákærandi'
    const court = 'Héraðsdómur Austurlands'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      type,
      prosecutorName,
      court,
    )

    // Assert
    expect(res).toBe(
      'Farbannskrafa tilbúin til afgreiðslu. Ákærandi: Árni Ákærandi. Dómstóll: Héraðsdómur Austurlands.',
    )
  })
})

describe('formatProsecutorCourtDateEmailNotification', () => {
  test('should format court date notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = '101'
    const defenderName = 'Valdi Verjandi'

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      type,
      court,
      courtDate,
      courtRoom,
      defenderName,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram 24. desember 2020, kl. 18:00.<br /><br />Dómsalur: 101.<br /><br />Verjandi sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification with no defender', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = '101'

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      type,
      court,
      courtDate,
      courtRoom,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram 24. desember 2020, kl. 18:00.<br /><br />Dómsalur: 101.<br /><br />Verjandi sakbornings hefur ekki verið skráður.',
    )
  })

  test('should format court date notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const defenderName = 'Valdi Verjandi'

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      type,
      court,
      courtDate,
      courtRoom,
      defenderName,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir farbannskröfu.<br /><br />Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br /><br />Dómsalur: 999.<br /><br />Verjandi sakbornings: Valdi Verjandi.',
    )
  })
})

describe('formatPrisonCourtDateEmailNotification', () => {
  test('should format court date notification', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = CaseGender.FEMALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = true
    const defenderName = 'Varði Varnari'
    const isExtension = false

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn, 4. febrúar 2021, kl. 02:02.<br /><br />Nafn sakbornings: Maggi Murder.<br /><br />Kyn sakbornings: Kona.<br /><br />Krafist er gæsluvarðhalds til mánudagsins, 12. ágúst 2030, kl. 08:25.<br /><br />Farið er fram á einangrun.<br /><br />Verjandi sakbornings: Varði Varnari.',
    )
  })

  test('should format court date notification with unknown gender', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = CaseGender.OTHER
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = true
    const defenderName = 'Vala Verja'
    const isExtension = false

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn, 4. febrúar 2021, kl. 02:02.<br /><br />Nafn sakbornings: Maggi Murder.<br /><br />Kyn sakbornings: Kynsegin/Annað.<br /><br />Krafist er gæsluvarðhalds til mánudagsins, 12. ágúst 2030, kl. 08:25.<br /><br />Farið er fram á einangrun.<br /><br />Verjandi sakbornings: Vala Verja.',
    )
  })

  test('should format court date notification with no isolation', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = CaseGender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = 'Vala Verja'
    const isExtension = false

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn, 4. febrúar 2021, kl. 02:02.<br /><br />Nafn sakbornings: Maggi Murder.<br /><br />Kyn sakbornings: Karl.<br /><br />Krafist er gæsluvarðhalds til mánudagsins, 12. ágúst 2030, kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Verjandi sakbornings: Vala Verja.',
    )
  })

  test('should format court date notification with no defender', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = CaseGender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      undefined,
      isExtension,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn, 4. febrúar 2021, kl. 02:02.<br /><br />Nafn sakbornings: Maggi Murder.<br /><br />Kyn sakbornings: Karl.<br /><br />Krafist er gæsluvarðhalds til mánudagsins, 12. ágúst 2030, kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Verjandi sakbornings hefur ekki verið skráður.',
    )
  })

  test('should format court date notification for extension requests', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-11T12:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = CaseGender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = 'Vala Verja'
    const isExtension = true

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um áframhaldandi gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn, 11. febrúar 2021, kl. 12:02.<br /><br />Nafn sakbornings: Maggi Murder.<br /><br />Kyn sakbornings: Karl.<br /><br />Krafist er gæsluvarðhalds til mánudagsins, 12. ágúst 2030, kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Verjandi sakbornings: Vala Verja.',
    )
  })
})

describe('formatDefenderCourtDateEmailNotification', () => {
  test('should format defender court date notification', () => {
    // Arrange
    const court = 'Héraðsdómur Norðurlands'
    const courtCaseNumber = 'R-77/2021'
    const courtDate = new Date('2020-12-19T10:19')
    const courtRoom = '101'

    // Act
    const res = formatDefenderCourtDateEmailNotification(
      court,
      courtCaseNumber,
      courtDate,
      courtRoom,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram laugardaginn, 19. desember 2020, kl. 10:19.<br /><br />Málsnúmer: R-77/2021.<br /><br />Dómsalur: 101.',
    )
  })

  test('should format defender court date notification for travel ban', () => {
    // Arrange
    const court = 'Héraðsdómur Norðurlands'
    const courtCaseNumber = 'R-77/2021'
    const courtDate = new Date('2020-12-19T10:19')
    const courtRoom = '101'

    // Act
    const res = formatDefenderCourtDateEmailNotification(
      court,
      courtCaseNumber,
      courtDate,
      courtRoom,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram laugardaginn, 19. desember 2020, kl. 10:19.<br /><br />Málsnúmer: R-77/2021.<br /><br />Dómsalur: 101.',
    )
  })
})

describe('formatCourtDateNotificationCondition', () => {
  test('should format prison court date notification', () => {
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

describe('formatPrisonRulingEmailNotification', () => {
  test('should format prison ruling notification', () => {
    // Arrange
    const accusedNationalId = '2411018760'
    const accusedName = 'Biggi Börgler'
    const accusedGender = CaseGender.MALE
    const court = 'Héraðsdómur Vesturlands'
    const prosecutorName = 'Siggi Sakó'
    const courtEndTime = new Date('2020-12-20T13:32')
    const defenderName = 'Skúli Skjöldur'
    const defenderEmail = 'shield@defend.is'
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2021-04-06T12:30')
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]
    const accusedAppealDecision = CaseAppealDecision.APPEAL
    const prosecutorAppealDecision = CaseAppealDecision.ACCEPT
    const judgeName = 'Dalli Dómari'
    const judgeTitle = 'aðal dómarinn'
    const isExtension = false

    // Act
    const res = formatPrisonRulingEmailNotification(
      accusedNationalId,
      accusedName,
      accusedGender,
      court,
      prosecutorName,
      courtEndTime,
      defenderName,
      defenderEmail,
      decision,
      validToDate,
      custodyRestrictions,
      accusedAppealDecision,
      prosecutorAppealDecision,
      judgeName,
      judgeTitle,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      '<strong>Úrskurður um gæsluvarðhald</strong><br /><br />Héraðsdómur Vesturlands, 20. desember 2020.<br /><br />Þinghaldi lauk kl. 13:32.<br /><br />Ákærandi: Siggi Sakó.<br />Verjandi: Skúli Skjöldur, shield@defend.is.<br /><br /><strong>Úrskurðarorð</strong><br /><br />Kærði, Biggi Börgler, kt. 241101-8760, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 6. apríl 2021, kl. 12:30. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.<br /><br /><strong>Ákvörðun um kæru</strong><br />Kærði kærir úrskurðinn.<br />Sækjandi unir úrskurðinum.<br /><br /><strong>Tilhögun gæsluvarðhalds</strong><br />Sækjandi tekur fram að kærði skuli sæta einangrun á meðan á gæsluvarðhaldinu stendur og að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.<br /><br />Dalli Dómari aðal dómarinn',
    )
  })

  test('should format prison ruling notification for a rejected case', () => {
    // Arrange
    const accusedNationalId = '2411018760'
    const accusedName = 'Biggi Börgler'
    const accusedGender = CaseGender.MALE
    const court = 'Héraðsdómur Vesturlands'
    const prosecutorName = 'Siggi Sakó'
    const courtEndTime = new Date('2020-12-20T14:30')
    const defenderName = 'Skúli Skjöldur'
    const defenderEmail = 'shield@defend.is'
    const decision = CaseDecision.REJECTING
    const validToDate = new Date('2021-04-06T12:30')
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]
    const accusedAppealDecision = CaseAppealDecision.APPEAL
    const prosecutorAppealDecision = CaseAppealDecision.ACCEPT
    const judgeName = 'Dalli Dómari'
    const judgeTitle = 'aðal dómarinn'
    const isExtension = false

    // Act
    const res = formatPrisonRulingEmailNotification(
      accusedNationalId,
      accusedName,
      accusedGender,
      court,
      prosecutorName,
      courtEndTime,
      defenderName,
      defenderEmail,
      decision,
      validToDate,
      custodyRestrictions,
      accusedAppealDecision,
      prosecutorAppealDecision,
      judgeName,
      judgeTitle,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      '<strong>Úrskurður um gæsluvarðhald</strong><br /><br />Héraðsdómur Vesturlands, 20. desember 2020.<br /><br />Þinghaldi lauk kl. 14:30.<br /><br />Ákærandi: Siggi Sakó.<br />Verjandi: Skúli Skjöldur, shield@defend.is.<br /><br /><strong>Úrskurðarorð</strong><br /><br />Kröfu um að kærði, Biggi Börgler, kt. 241101-8760, sæti gæsluvarðhaldi er hafnað.<br /><br /><strong>Ákvörðun um kæru</strong><br />Kærði kærir úrskurðinn.<br />Sækjandi unir úrskurðinum.<br /><br />Dalli Dómari aðal dómarinn',
    )
  })

  test('should format prison ruling notification when a defender has not been set', () => {
    // Arrange
    const accusedNationalId = '2411018760'
    const accusedName = 'Biggi Börgler'
    const accusedGender = CaseGender.MALE
    const court = 'Héraðsdómur Vesturlands'
    const prosecutorName = 'Siggi Sakó'
    const courtEndTime = new Date('2020-12-20T13:32')
    const defenderName = null
    const defenderEmail = null
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2021-04-06T12:30')
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]
    const accusedAppealDecision = CaseAppealDecision.APPEAL
    const prosecutorAppealDecision = CaseAppealDecision.ACCEPT
    const judgeName = 'Dalli Dómari'
    const judgeTitle = 'aðal dómarinn'
    const isExtension = false

    // Act
    const res = formatPrisonRulingEmailNotification(
      accusedNationalId,
      accusedName,
      accusedGender,
      court,
      prosecutorName,
      courtEndTime,
      defenderName,
      defenderEmail,
      decision,
      validToDate,
      custodyRestrictions,
      accusedAppealDecision,
      prosecutorAppealDecision,
      judgeName,
      judgeTitle,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      '<strong>Úrskurður um gæsluvarðhald</strong><br /><br />Héraðsdómur Vesturlands, 20. desember 2020.<br /><br />Þinghaldi lauk kl. 13:32.<br /><br />Ákærandi: Siggi Sakó.<br />Verjandi: Hefur ekki verið skráður.<br /><br /><strong>Úrskurðarorð</strong><br /><br />Kærði, Biggi Börgler, kt. 241101-8760, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 6. apríl 2021, kl. 12:30. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.<br /><br /><strong>Ákvörðun um kæru</strong><br />Kærði kærir úrskurðinn.<br />Sækjandi unir úrskurðinum.<br /><br /><strong>Tilhögun gæsluvarðhalds</strong><br />Sækjandi tekur fram að kærði skuli sæta einangrun á meðan á gæsluvarðhaldinu stendur og að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.<br /><br />Dalli Dómari aðal dómarinn',
    )
  })

  test('should format prison ruling notification when a defender name has not been set', () => {
    // Arrange
    const accusedNationalId = '2411018760'
    const accusedName = 'Biggi Börgler'
    const accusedGender = CaseGender.MALE
    const court = 'Héraðsdómur Vesturlands'
    const prosecutorName = 'Siggi Sakó'
    const courtEndTime = new Date('2020-12-20T13:32')
    const defenderName = null
    const defenderEmail = 'shield@defend.is'
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2021-04-06T12:30')
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]
    const accusedAppealDecision = CaseAppealDecision.APPEAL
    const prosecutorAppealDecision = CaseAppealDecision.ACCEPT
    const judgeName = 'Dalli Dómari'
    const judgeTitle = 'aðal dómarinn'
    const isExtension = false

    // Act
    const res = formatPrisonRulingEmailNotification(
      accusedNationalId,
      accusedName,
      accusedGender,
      court,
      prosecutorName,
      courtEndTime,
      defenderName,
      defenderEmail,
      decision,
      validToDate,
      custodyRestrictions,
      accusedAppealDecision,
      prosecutorAppealDecision,
      judgeName,
      judgeTitle,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      '<strong>Úrskurður um gæsluvarðhald</strong><br /><br />Héraðsdómur Vesturlands, 20. desember 2020.<br /><br />Þinghaldi lauk kl. 13:32.<br /><br />Ákærandi: Siggi Sakó.<br />Verjandi: shield@defend.is.<br /><br /><strong>Úrskurðarorð</strong><br /><br />Kærði, Biggi Börgler, kt. 241101-8760, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 6. apríl 2021, kl. 12:30. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.<br /><br /><strong>Ákvörðun um kæru</strong><br />Kærði kærir úrskurðinn.<br />Sækjandi unir úrskurðinum.<br /><br /><strong>Tilhögun gæsluvarðhalds</strong><br />Sækjandi tekur fram að kærði skuli sæta einangrun á meðan á gæsluvarðhaldinu stendur og að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.<br /><br />Dalli Dómari aðal dómarinn',
    )
  })

  test('should format prison ruling notification when an addition to the conclusion has been made', () => {
    // Arrange
    const accusedNationalId = '2411018760'
    const accusedName = 'Biggi Börgler'
    const accusedGender = CaseGender.MALE
    const court = 'Héraðsdómur Vesturlands'
    const prosecutorName = 'Siggi Sakó'
    const courtEndTime = new Date('2020-12-20T13:32')
    const defenderName = null
    const defenderEmail = 'shield@defend.is'
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2021-04-06T12:30')
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]
    const isolationToDate = new Date('2021-04-06T12:30')
    const accusedAppealDecision = CaseAppealDecision.APPEAL
    const prosecutorAppealDecision = CaseAppealDecision.ACCEPT
    const judgeName = 'Dalli Dómari'
    const judgeTitle = 'aðal dómarinn'
    const isExtension = false
    const additionToConclusion = 'Lorem ipsum'

    // Act
    const res = formatPrisonRulingEmailNotification(
      accusedNationalId,
      accusedName,
      accusedGender,
      court,
      prosecutorName,
      courtEndTime,
      defenderName,
      defenderEmail,
      decision,
      validToDate,
      custodyRestrictions,
      accusedAppealDecision,
      prosecutorAppealDecision,
      judgeName,
      judgeTitle,
      isExtension,
      undefined,
      additionToConclusion,
      isolationToDate,
    )

    // Assert
    expect(res).toBe(
      '<strong>Úrskurður um gæsluvarðhald</strong><br /><br />Héraðsdómur Vesturlands, 20. desember 2020.<br /><br />Þinghaldi lauk kl. 13:32.<br /><br />Ákærandi: Siggi Sakó.<br />Verjandi: shield@defend.is.<br /><br /><strong>Úrskurðarorð</strong><br /><br />Kærði, Biggi Börgler, kt. 241101-8760, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 6. apríl 2021, kl. 12:30. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.<br /><br />Lorem ipsum<br /><br /><strong>Ákvörðun um kæru</strong><br />Kærði kærir úrskurðinn.<br />Sækjandi unir úrskurðinum.<br /><br /><strong>Tilhögun gæsluvarðhalds</strong><br />Sækjandi tekur fram að kærði skuli sæta einangrun á meðan á gæsluvarðhaldinu stendur og að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.<br /><br />Dalli Dómari aðal dómarinn',
    )
  })
})

describe('formatCourtRevokedSmsNotification', () => {
  test('should format revoked sms with court date', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Kiddi Kærari'
    const requestedCourtDate = new Date('2021-01-20T11:10')
    const courtDate = new Date('2021-12-20T11:30')

    // Act
    const res = formatCourtRevokedSmsNotification(
      type,
      prosecutorName,
      requestedCourtDate,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa afturkölluð. Ákærandi: Kiddi Kærari. Fyrirtökutími: 20.12.2021, kl. 11:30.',
    )
  })

  test('should format revoked sms without court date', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Kiddi Kærari'
    const requestedCourtDate = new Date('2021-01-20T11:10')

    // Act
    const res = formatCourtRevokedSmsNotification(
      type,
      prosecutorName,
      requestedCourtDate,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa afturkölluð. Ákærandi: Kiddi Kærari. ÓVE fyrirtöku 20.01.2021, eftir kl. 11:10.',
    )
  })

  test('should format revoked sms without any info', () => {
    // Arrange
    const type = CaseType.CUSTODY

    // Act
    const res = formatCourtRevokedSmsNotification(
      type,
      undefined,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe('Gæsluvarðhaldskrafa afturkölluð. Ákærandi: Ekki skráður.')
  })

  test('should format revoked sms for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const prosecutorName = 'Kiddi Kærari'
    const requestedCourtDate = new Date('2021-01-20T11:10')
    const courtDate = new Date('2021-12-20T11:30')

    // Act
    const res = formatCourtRevokedSmsNotification(
      type,
      prosecutorName,
      requestedCourtDate,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Farbannskrafa afturkölluð. Ákærandi: Kiddi Kærari. Fyrirtökutími: 20.12.2021, kl. 11:30.',
    )
  })
})

describe('formatPrisonRevokedEmailNotification', () => {
  test('should format revoked notification', () => {
    // Arrange
    const prosecutorOffice = 'Aðalsaksóknari'
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')
    const accusedName = 'Gaui Glæpon'
    const defenderName = 'Dóri'
    const isExtension = false

    // Act
    const res = formatPrisonRevokedEmailNotification(
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      defenderName,
      isExtension,
    )

    // Assert
    expect(res).toBe(
      'Aðalsaksóknari hefur afturkallað kröfu um gæsluvarðhald sem send var til Héraðsdóms Þingvalla og taka átti fyrir sunnudaginn, 24. janúar 2021, kl. 08:15.<br /><br />Nafn sakbornings: Gaui Glæpon.<br /><br />Verjandi sakbornings: Dóri.',
    )
  })
})

describe('formatDefenderRevokedEmailNotification', () => {
  test('should format revoked notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0000001111'
    const accusedName = 'Gaui Glæpon'
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')

    // Act
    const res = formatDefenderRevokedEmailNotification(
      type,
      accusedNationalId,
      accusedName,
      court,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa sem taka átti fyrir hjá Héraðsdómi Þingvalla sunnudaginn, 24. janúar 2021, kl. 08:15, hefur verið afturkölluð.<br /><br />Sakborningur: Gaui Glæpon, kt. 000000-1111.<br /><br />Dómstóllinn hafði skráð þig sem verjanda sakbornings.',
    )
  })

  test('should format revoked notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const accusedNationalId = '1111001111'
    const accusedName = 'Gaui Glæpon'
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')

    // Act
    const res = formatDefenderRevokedEmailNotification(
      type,
      accusedNationalId,
      accusedName,
      court,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Farbannskrafa sem taka átti fyrir hjá Héraðsdómi Þingvalla sunnudaginn, 24. janúar 2021, kl. 08:15, hefur verið afturkölluð.<br /><br />Sakborningur: Gaui Glæpon, kt. 111100-1111.<br /><br />Dómstóllinn hafði skráð þig sem verjanda sakbornings.',
    )
  })
})

describe('stripHtmlTags', () => {
  test('should format court date notification condition', () => {
    // Arrange
    const html = 'bla<strong>blab</strong>la<br /><br />blabla'

    // Act
    const res = stripHtmlTags(html)

    // Assert
    expect(res).toBe('blablabla\n\nblabla')
  })
})
