import { FormatMessage } from '@island.is/cms-translations'
import { createTestIntl } from '@island.is/cms-translations/test'
import { makeProsecutor } from '@island.is/judicial-system/formatters'
import {
  CaseLegalProvisions,
  Gender,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system/types'

import { notifications } from '../messages'

import {
  formatProsecutorCourtDateEmailNotification,
  formatLegalProvisions,
  formatCourtHeadsUpSmsNotification,
  formatCourtReadyForCourtSmsNotification,
  formatPrisonCourtDateEmailNotification,
  stripHtmlTags,
  formatDefenderCourtDateEmailNotification,
  formatPrisonRulingEmailNotification,
  formatCourtRevokedSmsNotification,
  formatPrisonRevokedEmailNotification,
  formatDefenderRevokedEmailNotification,
  formatProsecutorReceivedByCourtSmsNotification,
  formatCourtResubmittedToCourtSmsNotification,
} from './formatters'

describe('formatLegalProvisions', () => {
  test('should format legal provisions when no provisions are selected', () => {
    // Arrange
    const legalProvisions: CaseLegalProvisions[] = []

    // Act
    const res = formatLegalProvisions(legalProvisions)

    // Assert
    expect(res).toBe('Lagaákvæði ekki skráð')
  })

  test('should format legal provisions when provisions not defined', () => {
    // Act
    const res = formatLegalProvisions()

    // Assert
    expect(res).toBe('Lagaákvæði ekki skráð')
  })

  test('should format legal provisions when some provisions are selected', () => {
    // Arrange
    const legalProvisions = [
      CaseLegalProvisions._95_1_A,
      CaseLegalProvisions._95_1_B,
      CaseLegalProvisions._95_1_C,
      CaseLegalProvisions._95_1_D,
      CaseLegalProvisions._95_2,
      CaseLegalProvisions._99_1_B,
      CaseLegalProvisions._100_1,
    ]

    // Act
    const res = formatLegalProvisions(legalProvisions)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr. sml.\nb-lið 1. mgr. 95. gr. sml.\nc-lið 1. mgr. 95. gr. sml.\nd-lið 1. mgr. 95. gr. sml.\n2. mgr. 95. gr. sml.\nb-lið 1. mgr. 99. gr. sml.\n1. mgr. 100. gr. sml.',
    )
  })

  test('should sort provisions when formatting legal provisions', () => {
    // Arrange
    const legalProvisions = [
      CaseLegalProvisions._95_1_C,
      CaseLegalProvisions._95_1_D,
      CaseLegalProvisions._95_1_A,
      CaseLegalProvisions._95_2,
      CaseLegalProvisions._99_1_B,
      CaseLegalProvisions._95_1_B,
      CaseLegalProvisions._100_1,
    ]

    // Act
    const res = formatLegalProvisions(legalProvisions)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr. sml.\nb-lið 1. mgr. 95. gr. sml.\nc-lið 1. mgr. 95. gr. sml.\nd-lið 1. mgr. 95. gr. sml.\n2. mgr. 95. gr. sml.\nb-lið 1. mgr. 99. gr. sml.\n1. mgr. 100. gr. sml.',
    )
  })

  test('should format legal provisions when some provisions are selected and additional freetext provided', () => {
    // Arrange
    const legalProvisions = [
      CaseLegalProvisions._95_1_A,
      CaseLegalProvisions._95_1_B,
      CaseLegalProvisions._95_1_C,
      CaseLegalProvisions._95_1_D,
      CaseLegalProvisions._95_2,
      CaseLegalProvisions._99_1_B,
      CaseLegalProvisions._100_1,
    ]
    const legalBasis = 'some lið mgr. gr. sml.'

    // Act
    const res = formatLegalProvisions(legalProvisions, legalBasis)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr. sml.\nb-lið 1. mgr. 95. gr. sml.\nc-lið 1. mgr. 95. gr. sml.\nd-lið 1. mgr. 95. gr. sml.\n2. mgr. 95. gr. sml.\nb-lið 1. mgr. 99. gr. sml.\n1. mgr. 100. gr. sml.\nsome lið mgr. gr. sml.',
    )
  })

  test('should format legal provisions only freetext provided', () => {
    // Arrange
    const legalBasis = 'some lið mgr. gr. sml.'

    // Act
    const res = formatLegalProvisions(undefined, legalBasis)

    // Assert
    expect(res).toBe('some lið mgr. gr. sml.')
  })
})

describe('formatHeadsUpSmsNotification', () => {
  const messages = {
    ...notifications.courtHeadsUp,
    prosecutorText: notifications.prosecutorText,
  }

  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl('is-IS', messages).formatMessage
  })

  test('should format heads up notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Árni Ákærandi'
    const arrestDate = new Date('2020-11-24T13:22')
    const requestedCourtDate = new Date('2020-11-25T09:15')

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      arrestDate,
      requestedCourtDate,
    )

    // Assert
    expect(res).toBe(
      'Ný gæsluvarðhaldskrafa í vinnslu. Sækjandi: Árni Ákærandi. Viðkomandi handtekinn 24.11.2020, kl. 13:22. ÓE fyrirtöku 25.11.2020, eftir kl. 09:15.',
    )
  })

  test('should format heads up notification with missing dates', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const prosecutorName = 'Árni Ákærandi'

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe('Ný farbannskrafa í vinnslu. Sækjandi: Árni Ákærandi.')
  })

  test('should format heads up notification with missing prosecutor', () => {
    // Arrange
    const type = CaseType.ADMISSION_TO_FACILITY

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      formatMessage,
      type,
      undefined,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Ný krafa um vistun á viðeigandi stofnun í vinnslu. Sækjandi: Ekki skráður.',
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
      formatMessage,
      type,
      prosecutorName,
      arrestDate,
      requestedCourtDate,
    )

    // Assert
    expect(res).toBe(
      'Ný farbannskrafa í vinnslu. Sækjandi: Ákærandinn. Viðkomandi handtekinn 24.01.2021, kl. 13:00. ÓE fyrirtöku 25.01.2021, eftir kl. 19:15.',
    )
  })

  test('should format heads up notification for investigation', () => {
    // Arrange
    const type = CaseType.BODY_SEARCH
    const prosecutorName = 'Al Coe'
    const arrestDate = new Date('2021-01-24T13:00')
    const requestedCourtDate = new Date('2021-06-20T10:00')

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      arrestDate,
      requestedCourtDate,
    )

    // Assert
    expect(res).toBe(
      'Ný krafa um rannsóknarheimild (leit og líkamsrannsókn) í vinnslu. Sækjandi: Al Coe. Viðkomandi handtekinn 24.01.2021, kl. 13:00. ÓE fyrirtöku 20.06.2021, eftir kl. 10:00.',
    )
  })

  test('should format heads up notification for investigation of type OTHER', () => {
    // Arrange
    const type = CaseType.OTHER
    const prosecutorName = 'Al Coe'
    const arrestDate = new Date('2021-01-24T13:00')
    const requestedCourtDate = new Date('2021-06-20T10:00')

    // Act
    const res = formatCourtHeadsUpSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      arrestDate,
      requestedCourtDate,
    )

    // Assert
    expect(res).toBe(
      'Ný krafa um rannsóknarheimild í vinnslu. Sækjandi: Al Coe. Viðkomandi handtekinn 24.01.2021, kl. 13:00. ÓE fyrirtöku 20.06.2021, eftir kl. 10:00.',
    )
  })
})

describe('formatReadyForCourtSmsNotification', () => {
  const messages = {
    ...notifications.courtReadyForCourt,
    prosecutorText: notifications.prosecutorText,
  }

  let formatMessage: FormatMessage
  beforeAll(() => {
    const intl = createTestIntl('is-IS', messages)
    formatMessage = intl.formatMessage
  })

  test('should format ready for court SMS notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Árni Ákærandi'
    const court = 'Héraðsdómur Reykjavíkur'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      court,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi. Dómstóll: Héraðsdómur Reykjavíkur.',
    )
  })

  test('should format ready for court SMS notification with missing prosecutor and court', () => {
    // Arrange
    const type = CaseType.CUSTODY

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Sækjandi: Ekki skráður. Dómstóll: Ekki skráður.',
    )
  })

  test('should format ready for court SMS notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const prosecutorName = 'Árni Ákærandi'
    const court = 'Héraðsdómur Austurlands'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      court,
    )

    // Assert
    expect(res).toBe(
      'Farbannskrafa tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi. Dómstóll: Héraðsdómur Austurlands.',
    )
  })

  test('should format ready for court SMS notification for admission to facility', () => {
    // Arrange
    const type = CaseType.ADMISSION_TO_FACILITY
    const prosecutorName = 'Árni Ákærandi'
    const court = 'Héraðsdómur Austurlands'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      court,
    )

    // Assert
    expect(res).toBe(
      'Krafa um vistun á viðeigandi stofnun tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi. Dómstóll: Héraðsdómur Austurlands.',
    )
  })

  test('should format ready for court SMS notification for investigation', () => {
    // Arrange
    const type = CaseType.INTERNET_USAGE
    const prosecutorName = 'Árni Ákærandi'
    const court = 'Héraðsdómur Austurlands'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      court,
    )

    // Assert
    expect(res).toBe(
      'Krafa um rannsóknarheimild (upplýsingar um vefnotkun) tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi. Dómstóll: Héraðsdómur Austurlands.',
    )
  })

  test('should format ready for court SMS notification for investigation of type OTHER', () => {
    // Arrange
    const type = CaseType.OTHER
    const prosecutorName = 'Árni Ákærandi'
    const court = 'Héraðsdómur Austurlands'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      court,
    )

    // Assert
    expect(res).toBe(
      'Krafa um rannsóknarheimild tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi. Dómstóll: Héraðsdómur Austurlands.',
    )
  })
})

describe('formatReadyForCourtSmsNotification', () => {
  const messages = {
    courtResubmittedToCourt: notifications.courtResubmittedToCourt,
  }
  let formatMessage: FormatMessage
  beforeAll(() => {
    const intl = createTestIntl('is-IS', messages)
    formatMessage = intl.formatMessage
  })

  test('should format ready for court SMS notification', () => {
    // Arrange
    const courtCaseNumber = 'R-123/2021'

    // Act
    const res = formatCourtResubmittedToCourtSmsNotification(
      formatMessage,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi í máli R-123/2021 hefur breytt kröfunni og sent aftur á héraðsdómstól. Nýtt kröfuskjal hefur verið vistað í Auði.',
    )
  })
})

describe('formatProsecutorReceivedByCourtSmsNotification', () => {
  const messages = {
    prosecutorReceivedByCourt: notifications.prosecutorReceivedByCourt,
  }

  let formatMessage: FormatMessage
  beforeAll(() => {
    const intl = createTestIntl('is-IS', messages)
    formatMessage = intl.formatMessage
  })
  test('should format received by court notification for custody', () => {
    // Arranged
    const type = CaseType.CUSTODY
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-898/2021'

    // Act
    const res = formatProsecutorReceivedByCourtSmsNotification(
      formatMessage,
      type,
      court,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur móttekið kröfu um gæsluvarðhald sem þú sendir og úthlutað málsnúmerinu R-898/2021. Sjá nánar á rettarvorslugatt.island.is.',
    )
  })

  test('should format received by court notification for travel ban', () => {
    // Arranged
    const type = CaseType.TRAVEL_BAN
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-898/2021'

    // Act
    const res = formatProsecutorReceivedByCourtSmsNotification(
      formatMessage,
      type,
      court,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur móttekið kröfu um farbann sem þú sendir og úthlutað málsnúmerinu R-898/2021. Sjá nánar á rettarvorslugatt.island.is.',
    )
  })

  test('should format received by court notification for admission to facility', () => {
    // Arranged
    const type = CaseType.ADMISSION_TO_FACILITY
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-898/2021'

    // Act
    const res = formatProsecutorReceivedByCourtSmsNotification(
      formatMessage,
      type,
      court,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur móttekið kröfu um vistun á viðeigandi stofnun sem þú sendir og úthlutað málsnúmerinu R-898/2021. Sjá nánar á rettarvorslugatt.island.is.',
    )
  })

  test('should format received by court notification for investigation', () => {
    // Arranged
    const type = CaseType.SEARCH_WARRANT
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-898/2021'

    // Act
    const res = formatProsecutorReceivedByCourtSmsNotification(
      formatMessage,
      type,
      court,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur móttekið kröfu um rannsóknarheimild (húsleit) sem þú sendir og úthlutað málsnúmerinu R-898/2021. Sjá nánar á rettarvorslugatt.island.is.',
    )
  })

  test('should format received by court notification for investigation of type OTHER', () => {
    // Arranged
    const type = CaseType.OTHER
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-898/2021'

    // Act
    const res = formatProsecutorReceivedByCourtSmsNotification(
      formatMessage,
      type,
      court,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur móttekið kröfu um rannsóknarheimild sem þú sendir og úthlutað málsnúmerinu R-898/2021. Sjá nánar á rettarvorslugatt.island.is.',
    )
  })
})

describe('formatProsecutorCourtDateEmailNotification', () => {
  const messsages = {
    ...notifications.prosecutorCourtDateEmail,
    courtRoom: notifications.courtRoom,
    judge: notifications.judge,
    defender: notifications.defender,
    registrar: notifications.registrar,
  }

  let formatMessage: FormatMessage
  beforeAll(() => {
    const intl = createTestIntl('is-IS', messsages)
    formatMessage = intl.formatMessage
  })

  test('should format court date notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = '101'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'
    const sessionArrangements = undefined

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br/><br/>Fyrirtaka mun fara fram 24. desember 2020, kl. 18:00.<br/><br/>Dómsalur: 101.<br/><br/>Dómari: Dóra Dómari.<br/><br/>Dómritari: Dalli Dómritari.<br/><br/>Verjandi sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification with no judge, registrar and defender', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = '101'
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      court,
      courtDate,
      courtRoom,
      undefined,
      undefined,
      undefined,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br/><br/>Fyrirtaka mun fara fram 24. desember 2020, kl. 18:00.<br/><br/>Dómsalur: 101.<br/><br/>Dómari hefur ekki verið skráður.<br/><br/>Talsmaður sakbornings hefur ekki verið skráður.',
    )
  })

  test('should format court date notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um farbann.<br/><br/>Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br/><br/>Dómsalur: 999.<br/><br/>Dómari: Dóra Dómari.<br/><br/>Dómritari: Dalli Dómritari.<br/><br/>Talsmaður sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification for admission to facility', () => {
    // Arrange
    const type = CaseType.ADMISSION_TO_FACILITY
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um vistun á viðeigandi stofnun.<br/><br/>Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br/><br/>Dómsalur: 999.<br/><br/>Dómari: Dóra Dómari.<br/><br/>Dómritari: Dalli Dómritari.<br/><br/>Talsmaður sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification for investigation', () => {
    // Arrange
    const type = CaseType.SOUND_RECORDING_EQUIPMENT
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = undefined
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um rannsóknarheimild (hljóðupptökubúnaði komið fyrir).<br/><br/>Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br/><br/>Dómsalur: 999.<br/><br/>Dómari: Dóra Dómari.<br/><br/>Dómritari: Dalli Dómritari.<br/><br/>Verjandi sakbornings hefur ekki verið skráður.',
    )
  })

  test('should format court date notification for investigation of type OTHER', () => {
    // Arrange
    const type = CaseType.OTHER
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um rannsóknarheimild.<br/><br/>Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br/><br/>Dómsalur: 999.<br/><br/>Dómari: Dóra Dómari.<br/><br/>Dómritari: Dalli Dómritari.<br/><br/>Verjandi sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification when defender will not attend', () => {
    // Arrange
    const type = CaseType.OTHER
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Tinni Talsmaður'
    const sessionArrangements = SessionArrangements.PROSECUTOR_PRESENT

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um rannsóknarheimild.<br/><br/>Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br/><br/>Dómsalur: 999.<br/><br/>Dómari: Dóra Dómari.<br/><br/>Dómritari: Dalli Dómritari.',
    )
  })

  test('should format court date notification when courtroom is not set', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = undefined
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'

    // Act
    const res = formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br/><br/>Fyrirtaka mun fara fram 24. desember 2020, kl. 18:00.<br/><br/>Dómsalur hefur ekki verið skráður.<br/><br/>Dómari: Dóra Dómari.<br/><br/>Dómritari: Dalli Dómritari.<br/><br/>Verjandi sakbornings: Valdi Verjandi.',
    )
  })
})

describe('formatPrisonCourtDateEmailNotification', () => {
  const messages = {
    ...notifications.prisonCourtDateEmail,
    defender: notifications.defender,
  }

  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl('is-IS', messages).formatMessage
  })

  test('should format court date notification', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = Gender.FEMALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = true
    const defenderName = 'Varði Varnari'
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br/><br/>Nafn sakbornings: Maggi Murder.<br/><br/>Kyn sakbornings: Kona.<br/><br/>Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br/><br/>Farið er fram á einangrun.<br/><br/>Verjandi sakbornings: Varði Varnari.',
    )
  })

  test('should format court date notification with unknown gender', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = Gender.OTHER
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = true
    const defenderName = 'Vala Verja'
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br/><br/>Nafn sakbornings: Maggi Murder.<br/><br/>Kyn sakbornings: Kynsegin/Annað.<br/><br/>Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br/><br/>Farið er fram á einangrun.<br/><br/>Talsmaður sakbornings: Vala Verja.',
    )
  })

  test('should format court date notification with no isolation', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = Gender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = 'Vala Verja'
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br/><br/>Nafn sakbornings: Maggi Murder.<br/><br/>Kyn sakbornings: Karl.<br/><br/>Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br/><br/>Ekki er farið fram á einangrun.<br/><br/>Talsmaður sakbornings: Vala Verja.',
    )
  })

  test('should format court date notification with no defender', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = Gender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = undefined
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br/><br/>Nafn sakbornings: Maggi Murder.<br/><br/>Kyn sakbornings: Karl.<br/><br/>Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br/><br/>Ekki er farið fram á einangrun.<br/><br/>Verjandi sakbornings hefur ekki verið skráður.',
    )
  })

  test('should format court date notification for extension requests', () => {
    // Arrange
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-11T12:02')
    const accusedName = 'Maggi Murder'
    const accusedGender = Gender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = undefined
    const isExtension = true
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um áframhaldandi gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 11. febrúar 2021, kl. 12:02.<br/><br/>Nafn sakbornings: Maggi Murder.<br/><br/>Kyn sakbornings: Karl.<br/><br/>Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br/><br/>Ekki er farið fram á einangrun.<br/><br/>Talsmaður sakbornings hefur ekki verið skráður.',
    )
  })
})

describe('formatDefenderCourtDateEmailNotification', () => {
  const messages = {
    ...notifications.defenderCourtDateEmail,
    courtRoom: notifications.courtRoom,
    judge: notifications.judge,
    registrar: notifications.registrar,
  }

  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl('is-IS', messages).formatMessage
  })

  test('should format defender court date notification', () => {
    // Arrange
    const court = 'Héraðsdómur Norðurlands'
    const courtCaseNumber = 'R-77/2021'
    const courtDate = new Date('2020-12-19T10:19')
    const courtRoom = '101'
    const judgeName = 'Judy'
    const registrarName = 'Robin'
    const prosecutor = makeProsecutor()
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = formatDefenderCourtDateEmailNotification(
      formatMessage,
      court,
      courtCaseNumber,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      prosecutor.name,
      prosecutor.institution?.name,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br/><br/>Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br/><br/>Málsnúmer: R-77/2021.<br/><br/>Dómsalur: 101.<br/><br/>Dómari: Judy.<br/><br/>Dómritari: Robin.<br/><br/>Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
    )
  })

  test('should format spokesperson court date notification', () => {
    // Arrange
    const court = 'Héraðsdómur Norðurlands'
    const courtCaseNumber = 'R-77/2021'
    const courtDate = new Date('2020-12-19T10:19')
    const courtRoom = '101'
    const judgeName = 'Judy'
    const registrarName = 'Robin'
    const prosecutor = makeProsecutor()
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = formatDefenderCourtDateEmailNotification(
      formatMessage,
      court,
      courtCaseNumber,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      prosecutor.name,
      prosecutor.institution?.name,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem talsmann sakbornings.<br/><br/>Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br/><br/>Málsnúmer: R-77/2021.<br/><br/>Dómsalur: 101.<br/><br/>Dómari: Judy.<br/><br/>Dómritari: Robin.<br/><br/>Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
    )
  })

  test('should format defender court date notification when courtroom is not set', () => {
    // Arrange
    const court = 'Héraðsdómur Norðurlands'
    const courtCaseNumber = 'R-77/2021'
    const courtDate = new Date('2020-12-19T10:19')
    const courtRoom = undefined
    const judgeName = 'Judy'
    const registrarName = 'Robin'
    const prosecutor = makeProsecutor()
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = formatDefenderCourtDateEmailNotification(
      formatMessage,
      court,
      courtCaseNumber,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      prosecutor.name,
      prosecutor.institution?.name,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br/><br/>Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br/><br/>Málsnúmer: R-77/2021.<br/><br/>Dómsalur hefur ekki verið skráður.<br/><br/>Dómari: Judy.<br/><br/>Dómritari: Robin.<br/><br/>Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
    )
  })

  test('should format defender court date notification when registrar is not set', () => {
    // Arrange
    const court = 'Héraðsdómur Norðurlands'
    const courtCaseNumber = 'R-77/2021'
    const courtDate = new Date('2020-12-19T10:19')
    const courtRoom = undefined
    const judgeName = 'Judy'
    const prosecutor = makeProsecutor()
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = formatDefenderCourtDateEmailNotification(
      formatMessage,
      court,
      courtCaseNumber,
      courtDate,
      courtRoom,
      judgeName,
      undefined,
      prosecutor.name,
      prosecutor.institution?.name,
      sessionArrangements,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br/><br/>Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br/><br/>Málsnúmer: R-77/2021.<br/><br/>Dómsalur hefur ekki verið skráður.<br/><br/>Dómari: Judy.<br/><br/>Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
    )
  })
})

describe('formatPrisonRulingEmailNotification', () => {
  const messages = { prisonRulingEmail: notifications.prisonRulingEmail }
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl('is-IS', messages).formatMessage
  })
  test('should format prison ruling notification', () => {
    // Arrange
    const courtEndTime = new Date('2020-12-20T13:32')

    // Act
    const res = formatPrisonRulingEmailNotification(formatMessage, courtEndTime)

    // Assert
    expect(res).toBe(
      'Meðfylgjandi er vistunarseðill gæsluvarðhaldsfanga sem var úrskurðaður í gæsluvarðhald í héraðsdómi 20. desember 2020, auk þingbókar þar sem úrskurðarorðin koma fram.',
    )
  })
})

describe('formatCourtRevokedSmsNotification', () => {
  let formatMessage: FormatMessage

  beforeAll(() => {
    const messages = {
      ...notifications.courtRevoked,
      prosecutorText: notifications.prosecutorText,
    }

    const intl = createTestIntl('is-IS', messages)
    formatMessage = intl.formatMessage
  })

  test('should format revoked sms with court date', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Kiddi Kærari'
    const requestedCourtDate = new Date('2021-01-20T11:10')
    const courtDate = new Date('2021-12-20T11:30')

    // Act
    const res = formatCourtRevokedSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      requestedCourtDate,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa afturkölluð. Sækjandi: Kiddi Kærari. Fyrirtökutími: 20.12.2021, kl. 11:30.',
    )
  })

  test('should format revoked sms without court date', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Kiddi Kærari'
    const requestedCourtDate = new Date('2021-01-20T11:10')

    // Act
    const res = formatCourtRevokedSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      requestedCourtDate,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa afturkölluð. Sækjandi: Kiddi Kærari. ÓVE fyrirtöku 20.01.2021, eftir kl. 11:10.',
    )
  })

  test('should format revoked sms without any info', () => {
    // Arrange
    const type = CaseType.CUSTODY

    // Act
    const res = formatCourtRevokedSmsNotification(
      formatMessage,
      type,
      undefined,
      undefined,
      undefined,
    )

    // Assert
    expect(res).toBe('Gæsluvarðhaldskrafa afturkölluð. Sækjandi: Ekki skráður.')
  })

  test('should format revoked sms for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const prosecutorName = 'Kiddi Kærari'
    const requestedCourtDate = new Date('2021-01-20T11:10')
    const courtDate = new Date('2021-12-20T11:30')

    // Act
    const res = formatCourtRevokedSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      requestedCourtDate,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Farbannskrafa afturkölluð. Sækjandi: Kiddi Kærari. Fyrirtökutími: 20.12.2021, kl. 11:30.',
    )
  })

  test('should format revoked sms for admission to facility', () => {
    // Arrange
    const type = CaseType.ADMISSION_TO_FACILITY
    const prosecutorName = 'Kiddi Kærari'
    const requestedCourtDate = new Date('2021-01-20T11:10')
    const courtDate = new Date('2021-12-20T11:30')

    // Act
    const res = formatCourtRevokedSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      requestedCourtDate,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Krafa um vistun á viðeigandi stofnun afturkölluð. Sækjandi: Kiddi Kærari. Fyrirtökutími: 20.12.2021, kl. 11:30.',
    )
  })
})

describe('formatPrisonRevokedEmailNotification', () => {
  const messages = {
    ...notifications.prisonRevokedEmail,
    accused: notifications.accused,
  }

  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl('is-IS', messages).formatMessage
  })

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
      formatMessage,
      prosecutorOffice,
      court,
      courtDate,
      accusedName,
      defenderName,
      isExtension,
    )

    // Assert
    expect(res).toBe(
      'Aðalsaksóknari hefur afturkallað kröfu um gæsluvarðhald sem send var til Héraðsdóms Þingvalla og taka átti fyrir sunnudaginn 24. janúar 2021, kl. 08:15.<br/><br/>Nafn sakbornings: Gaui Glæpon.<br/><br/>Verjandi sakbornings: Dóri.',
    )
  })
})

describe('formatDefenderRevokedEmailNotification', () => {
  const messages = { ...notifications.defenderRevokedEmail }
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl('is-IS', messages).formatMessage
  })

  test('should format revoked notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const defendantNationalId = '0000001111'
    const defendantName = 'Gaui Glæpon'
    const defendantNoNationalId = false
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')

    // Act
    const res = formatDefenderRevokedEmailNotification(
      formatMessage,
      type,
      defendantNationalId,
      defendantName,
      defendantNoNationalId,
      court,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Krafa um gæsluvarðhald sem taka átti fyrir hjá Héraðsdómi Þingvalla sunnudaginn 24. janúar 2021, kl. 08:15, hefur verið afturkölluð.<br/><br/>Sakborningur: Gaui Glæpon, kt. 000000-1111.<br/><br/>Dómstóllinn hafði skráð þig sem verjanda sakbornings.',
    )
  })

  test('should format revoked notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const defendantNationalId = '1111001111'
    const defendantName = 'Gaui Glæpon'
    const defendantNoNationalId = false
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')

    // Act
    const res = formatDefenderRevokedEmailNotification(
      formatMessage,
      type,
      defendantNationalId,
      defendantName,
      defendantNoNationalId,
      court,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Krafa um farbann sem taka átti fyrir hjá Héraðsdómi Þingvalla sunnudaginn 24. janúar 2021, kl. 08:15, hefur verið afturkölluð.<br/><br/>Sakborningur: Gaui Glæpon, kt. 111100-1111.<br/><br/>Dómstóllinn hafði skráð þig sem verjanda sakbornings.',
    )
  })

  test('should format revoked notification for admission to facility', () => {
    // Arrange
    const type = CaseType.ADMISSION_TO_FACILITY
    const defendantNationalId = undefined
    const defendantName = undefined
    const defendantNoNationalId = false
    const court = undefined
    const courtDate = undefined

    // Act
    const res = formatDefenderRevokedEmailNotification(
      formatMessage,
      type,
      defendantNationalId,
      defendantName,
      defendantNoNationalId,
      court,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Krafa um vistun á viðeigandi stofnun sem taka átti fyrir hjá ótilgreindum dómstóli á ótilgreindum tíma, hefur verið afturkölluð.<br/><br/>Sakborningur: Nafn ekki skráð, kt. ekki skráð.<br/><br/>Dómstóllinn hafði skráð þig sem verjanda sakbornings.',
    )
  })

  test('should format revoked notification for investigation', () => {
    // Arrange
    const type = CaseType.BANKING_SECRECY_WAIVER
    const defendantNationalId = '1111001111'
    const defendantName = 'Gaui Glæpon'
    const defendantNoNationalId = false
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')

    // Act
    const res = formatDefenderRevokedEmailNotification(
      formatMessage,
      type,
      defendantNationalId,
      defendantName,
      defendantNoNationalId,
      court,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Krafa um rannsóknarheimild (rof bankaleyndar) sem taka átti fyrir hjá Héraðsdómi Þingvalla sunnudaginn 24. janúar 2021, kl. 08:15, hefur verið afturkölluð.<br/><br/>Sakborningur: Gaui Glæpon, kt. 111100-1111.<br/><br/>Dómstóllinn hafði skráð þig sem verjanda sakbornings.',
    )
  })

  test('should format revoked notification when defendant does not have a national id', () => {
    // Arrange
    const type = CaseType.OTHER
    const defendantNationalId = '01.01.2022'
    const defendantName = 'Gaui Glæpon'
    const defendantNoNationalId = true
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')

    // Act
    const res = formatDefenderRevokedEmailNotification(
      formatMessage,
      type,
      defendantNationalId,
      defendantName,
      defendantNoNationalId,
      court,
      courtDate,
    )

    // Assert
    expect(res).toBe(
      'Krafa um rannsóknarheimild sem taka átti fyrir hjá Héraðsdómi Þingvalla sunnudaginn 24. janúar 2021, kl. 08:15, hefur verið afturkölluð.<br/><br/>Sakborningur: Gaui Glæpon, fd. 01.01.2022.<br/><br/>Dómstóllinn hafði skráð þig sem verjanda sakbornings.',
    )
  })
})

describe('stripHtmlTags', () => {
  test('should strip html tags', () => {
    // Arrange
    const html =
      'bla<strong>blab</strong>la<br /><br />blabla<a href="blablabla">blabla</a>'

    // Act
    const res = stripHtmlTags(html)

    // Assert
    expect(res).toBe('blablabla\n\nblablablabla')
  })

  test('should strip html tags other br tag format', () => {
    // Arrange
    const html =
      'bla<strong>blab</strong>la<br/><br/>blabla<a href="blablabla">blabla</a>'

    // Act
    const res = stripHtmlTags(html)

    // Assert
    expect(res).toBe('blablabla\n\nblablablabla')
  })
})
