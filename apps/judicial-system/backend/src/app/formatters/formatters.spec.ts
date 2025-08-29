import { FormatMessage } from '@island.is/cms-translations'
import { createTestIntl } from '@island.is/cms-translations/test'

import { formatCaseType } from '@island.is/judicial-system/formatters'
import {
  CaseCustodyRestrictions,
  CaseLegalProvisions,
  CaseType,
  DefenderSubRole,
  Gender,
  InstitutionType,
  RequestSharedWithDefender,
  SessionArrangements,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { DateLog } from '../modules/repository'
import {
  filterWhitelistEmails,
  formatArraignmentDateEmailNotification,
  formatCourtHeadsUpSmsNotification,
  formatCourtReadyForCourtSmsNotification,
  formatCourtResubmittedToCourtSmsNotification,
  formatCourtRevokedSmsNotification,
  formatCustodyRestrictions,
  formatDefenderCourtDateEmailNotification,
  formatDefenderCourtDateLinkEmailNotification,
  formatDefenderResubmittedToCourtEmailNotification,
  formatLegalProvisions,
  formatPrisonAdministrationRulingNotification,
  formatPrisonCourtDateEmailNotification,
  formatPrisonRevokedEmailNotification,
  formatProsecutorCourtDateEmailNotification,
  formatProsecutorReadyForCourtEmailNotification,
  formatProsecutorReceivedByCourtSmsNotification,
  stripHtmlTags,
} from './formatters'

export const makeProsecutor = (): User => {
  return {
    id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    name: 'Áki Ákærandi',
    nationalId: '000000-0000',
    mobileNumber: '000-0000',
    email: 'prosecutor@law.is',
    role: UserRole.PROSECUTOR,
    active: true,
    title: 'aðstoðarsaksóknari',
    canConfirmIndictment: true,
    institution: {
      id: '',
      created: '',
      modified: '',
      type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
      name: 'Lögreglan á Höfuðborgarsvæðinu',
      active: true,
    },
  }
}

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
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
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
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
  })

  test('should format ready for court SMS notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const prosecutorName = 'Árni Ákærandi'
    const prosecutorInstution = 'Héraðssaksóknari'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      prosecutorInstution,
    )

    // Assert
    expect(res).toBe(
      'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi (Héraðssaksóknari).',
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
      'Gæsluvarðhaldskrafa tilbúin til afgreiðslu. Sækjandi: Ekki skráður.',
    )
  })

  test('should format ready for court SMS notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const prosecutorName = 'Árni Ákærandi'
    const prosecutorInstution = 'Ríkissaksóknari'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      prosecutorInstution,
    )

    // Assert
    expect(res).toBe(
      'Farbannskrafa tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi (Ríkissaksóknari).',
    )
  })

  test('should format ready for court SMS notification for admission to facility', () => {
    // Arrange
    const type = CaseType.ADMISSION_TO_FACILITY
    const prosecutorName = 'Árni Ákærandi'
    const prosecutorInstution = 'Héraðssaksóknari'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      prosecutorInstution,
    )

    // Assert
    expect(res).toBe(
      'Krafa um vistun á viðeigandi stofnun tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi (Héraðssaksóknari).',
    )
  })

  test('should format ready for court SMS notification for investigation', () => {
    // Arrange
    const type = CaseType.INTERNET_USAGE
    const prosecutorName = 'Árni Ákærandi'
    const prosecutorInstution = 'Héraðssaksóknari'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      prosecutorInstution,
    )

    // Assert
    expect(res).toBe(
      'Krafa um rannsóknarheimild (upplýsingar um vefnotkun) tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi (Héraðssaksóknari).',
    )
  })

  test('should format ready for court SMS notification for investigation of type OTHER', () => {
    // Arrange
    const type = CaseType.OTHER
    const prosecutorName = 'Árni Ákærandi'

    // Act
    const res = formatCourtReadyForCourtSmsNotification(
      formatMessage,
      type,
      prosecutorName,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Krafa um rannsóknarheimild tilbúin til afgreiðslu. Sækjandi: Árni Ákærandi.',
    )
  })
})

describe('formatReadyForCourtSmsNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
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

describe('formatProsecutorReadyForCourtEmailNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
  })

  const fn = (
    policeCaseNumbers: string[],
    caseType: CaseType,
    courtName?: string,
    overviewUrl?: string,
  ) =>
    formatProsecutorReadyForCourtEmailNotification(
      formatMessage,
      policeCaseNumbers,
      caseType,
      courtName,
      overviewUrl,
    )

  test('should format ready for court email for restriction cases', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const court = 'Héraðsdómur Reykjavíkur'
    const policeCaseNumbers = ['007-2022-01']
    const overviewUrl = 'https://rettarvorslugatt.island.is/test/overview'

    // Act
    const res = fn(policeCaseNumbers, type, court, overviewUrl)

    // Assert
    expect(res.subject).toBe(`Krafa um ${formatCaseType(type)} send`)
    expect(res.body).toBe(
      `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls 007-2022-01. Skjalið er aðgengilegt undir <a href="https://rettarvorslugatt.island.is/test/overview">málinu í Réttarvörslugátt</a>.`,
    )
  })

  test('should format ready for court email for investigation cases', () => {
    // Arrange
    const type = CaseType.INTERNET_USAGE
    const court = 'Héraðsdómur Reykjavíkur'
    const policeCaseNumbers = ['007-2022-01']
    const overviewUrl = 'https://rettarvorslugatt.island.is/test/overview'

    // Act
    const res = fn(policeCaseNumbers, type, court, overviewUrl)

    // Assert
    expect(res.subject).toBe(
      `Krafa um rannsóknarheimild send (${formatCaseType(type)})`,
    )
    expect(res.body).toBe(
      `Þú hefur sent kröfu á Héraðsdóm Reykjavíkur vegna LÖKE máls 007-2022-01. Skjalið er aðgengilegt undir <a href="https://rettarvorslugatt.island.is/test/overview">málinu í Réttarvörslugátt</a>.`,
    )
  })

  test('should format ready for court email for indictment cases', () => {
    // Arrange
    const type = CaseType.INDICTMENT
    const court = 'Héraðsdómur Reykjavíkur'
    const policeCaseNumbers = ['007-2022-02', '007-2022-01']
    const overviewUrl = 'https://rettarvorslugatt.island.is/test/overview'

    // Act
    const res = fn(policeCaseNumbers, type, court, overviewUrl)

    // Assert
    expect(res.subject).toBe(`Ákæra send`)
    expect(res.body).toBe(
      `Þú hefur sent ákæru á Héraðsdóm Reykjavíkur vegna LÖKE mála: 007-2022-02, 007-2022-01. Skjalið er aðgengilegt undir <a href="https://rettarvorslugatt.island.is/test/overview">málinu í Réttarvörslugátt</a>.`,
    )
  })
})

describe('formatProsecutorReceivedByCourtSmsNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
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

  test('should format received by court notification for an indictment', () => {
    // Arranged
    const type = CaseType.INDICTMENT
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
      'Héraðsdómur Reykjavíkur hefur móttekið ákæru sem þú sendir og úthlutað málsnúmerinu R-898/2021. Sjá nánar á rettarvorslugatt.island.is.',
    )
  })
})

describe('formatProsecutorCourtDateEmailNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
  })

  const fn = (
    type: CaseType,
    courtCaseNumber: string,
    court?: string,
    courtDate?: Date,
    courtRoom?: string,
    judgeName?: string,
    registrarName?: string,
    defenderName?: string,
    sessionArrangements?: SessionArrangements,
  ) =>
    formatProsecutorCourtDateEmailNotification(
      formatMessage,
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

  test('should format court date notification', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const courtCaseNumber = 'R-898/2021'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = '101'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'
    const sessionArrangements = undefined

    // Act
    const res = fn(
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res.subject).toBe('Fyrirtaka í máli: R-898/2021')
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br /><br />Fyrirtaka mun fara fram 24. desember 2020, kl. 18:00.<br /><br />Dómsalur: 101.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.<br /><br />Verjandi sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification with no judge, registrar and defender', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const courtCaseNumber = 'R-898/2021'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = '101'
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = fn(
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      undefined,
      undefined,
      undefined,
      sessionArrangements,
    )

    // Assert
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br /><br />Fyrirtaka mun fara fram 24. desember 2020, kl. 18:00.<br /><br />Dómsalur: 101.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Talsmaður sakbornings hefur ekki verið skráður.',
    )
  })

  test('should format court date notification for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const courtCaseNumber = 'R-898/2021'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = fn(
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um farbann.<br /><br />Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br /><br />Dómsalur: 999.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.<br /><br />Talsmaður sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification for admission to facility', () => {
    // Arrange
    const type = CaseType.ADMISSION_TO_FACILITY
    const courtCaseNumber = 'R-898/2021'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

    // Act
    const res = fn(
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um vistun á viðeigandi stofnun.<br /><br />Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br /><br />Dómsalur: 999.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.<br /><br />Talsmaður sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification for investigation', () => {
    // Arrange
    const type = CaseType.SOUND_RECORDING_EQUIPMENT
    const courtCaseNumber = 'R-898/2021'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = undefined
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = fn(
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um rannsóknarheimild (hljóðupptökubúnaði komið fyrir).<br /><br />Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br /><br />Dómsalur: 999.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.<br /><br />Verjandi sakbornings hefur ekki verið skráður.',
    )
  })

  test('should format court date notification for investigation of type OTHER', () => {
    // Arrange
    const type = CaseType.OTHER
    const courtCaseNumber = 'R-898/2021'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'
    const sessionArrangements = SessionArrangements.ALL_PRESENT

    // Act
    const res = fn(
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um rannsóknarheimild.<br /><br />Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br /><br />Dómsalur: 999.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.<br /><br />Verjandi sakbornings: Valdi Verjandi.',
    )
  })

  test('should format court date notification when defender will not attend', () => {
    // Arrange
    const type = CaseType.OTHER
    const courtCaseNumber = 'R-898/2021'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2021-12-24T10:00')
    const courtRoom = '999'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Tinni Talsmaður'
    const sessionArrangements = SessionArrangements.PROSECUTOR_PRESENT

    // Act
    const res = fn(
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
      sessionArrangements,
    )

    // Assert
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um rannsóknarheimild.<br /><br />Fyrirtaka mun fara fram 24. desember 2021, kl. 10:00.<br /><br />Dómsalur: 999.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.',
    )
  })

  test('should format court date notification when courtroom is not set', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const courtCaseNumber = 'R-898/2021'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtDate = new Date('2020-12-24T18:00')
    const courtRoom = undefined
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const defenderName = 'Valdi Verjandi'

    // Act
    const res = fn(
      type,
      courtCaseNumber,
      court,
      courtDate,
      courtRoom,
      judgeName,
      registrarName,
      defenderName,
    )

    // Assert
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br /><br />Fyrirtaka mun fara fram 24. desember 2020, kl. 18:00.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.<br /><br />Verjandi sakbornings: Valdi Verjandi.',
    )
  })
})

describe('formatArraignmentDateEmailNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
  })

  const fn = (
    arraignmentDateLog: DateLog,
    courtName?: string,
    courtCaseNumber?: string,
    judgeName?: string,
    registrarName?: string,
  ) =>
    formatArraignmentDateEmailNotification({
      formatMessage,
      courtName,
      courtCaseNumber,
      judgeName,
      registrarName,
      arraignmentDateLog,
    })

  test('should format arraignment date notification', () => {
    // Arrange
    const courtCaseNumber = 'S-898/2021'
    const courtName = 'Héraðsdómur Reykjavíkur'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const arraignmentDateLog = {
      date: new Date('2021-12-24T10:00'),
      location: '101',
    } as DateLog

    // Act
    const res = fn(
      arraignmentDateLog,
      courtName,
      courtCaseNumber,
      judgeName,
      registrarName,
    )

    // Assert
    expect(res.subject).toBe('Þingfesting í máli: S-898/2021')
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur boðar til þingfestingar í máli S-898/2021.<br /><br />Þingfesting mun fara fram 24. desember 2021, kl. 10:00.<br /><br />Dómsalur: 101.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.',
    )
  })

  test('should format arraignment date notification when courtroom is not set', () => {
    // Arrange
    const courtCaseNumber = 'S-898/2021'
    const courtName = 'Héraðsdómur Reykjavíkur'
    const judgeName = 'Dóra Dómari'
    const registrarName = 'Dalli Dómritari'
    const arraignmentDateLog = {
      date: new Date('2021-12-24T10:00'),
      location: undefined,
    } as DateLog

    // Act
    const res = fn(
      arraignmentDateLog,
      courtName,
      courtCaseNumber,
      judgeName,
      registrarName,
    )

    // Assert
    expect(res.body).toBe(
      'Héraðsdómur Reykjavíkur boðar til þingfestingar í máli S-898/2021.<br /><br />Þingfesting mun fara fram 24. desember 2021, kl. 10:00.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari: Dóra Dómari.<br /><br />Dómritari: Dalli Dómritari.',
    )
  })
})

describe('formatPrisonCourtDateEmailNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
  })

  test('should format court date notification', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = Gender.FEMALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = true
    const defenderName = 'Varði Varnari'
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT
    const courtCaseNumber = 'R-1232/1233'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br /><br />Kyn sakbornings: Kona.<br /><br />Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br /><br />Farið er fram á einangrun.<br /><br />Verjandi sakbornings: Varði Varnari.<br /><br />Málsnúmer héraðsdóms er R-1232/1233.',
    )
  })

  test('should format court date notification with unknown gender', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = Gender.OTHER
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = true
    const defenderName = 'Vala Verja'
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON
    const courtCaseNumber = 'R-1232/1233'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br /><br />Kyn sakbornings: Kynsegin/Annað.<br /><br />Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br /><br />Farið er fram á einangrun.<br /><br />Talsmaður sakbornings: Vala Verja.<br /><br />Málsnúmer héraðsdóms er R-1232/1233.',
    )
  })

  test('should format court date notification with no isolation', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = Gender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = 'Vala Verja'
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON
    const courtCaseNumber = 'R-1232/1233'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br /><br />Kyn sakbornings: Karl.<br /><br />Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Talsmaður sakbornings: Vala Verja.<br /><br />Málsnúmer héraðsdóms er R-1232/1233.',
    )
  })

  test('should format court date notification with undefined isolation', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = Gender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = undefined
    const defenderName = 'Vala Verja'
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON
    const courtCaseNumber = 'R-1232/1233'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br /><br />Kyn sakbornings: Karl.<br /><br />Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Talsmaður sakbornings: Vala Verja.<br /><br />Málsnúmer héraðsdóms er R-1232/1233.',
    )
  })

  test('should format court date notification with no defender', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-04T02:02')
    const accusedGender = Gender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = undefined
    const isExtension = false
    const sessionArrangements = SessionArrangements.ALL_PRESENT
    const courtCaseNumber = 'R-1232/1233'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 4. febrúar 2021, kl. 02:02.<br /><br />Kyn sakbornings: Karl.<br /><br />Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Verjandi sakbornings hefur ekki verið skráður.<br /><br />Málsnúmer héraðsdóms er R-1232/1233.',
    )
  })

  test('should format court date notification for extension requests', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-11T12:02')
    const accusedGender = Gender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = undefined
    const isExtension = true
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON
    const courtCaseNumber = 'R-1232/1233'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um áframhaldandi gæsluvarðhald til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 11. febrúar 2021, kl. 12:02.<br /><br />Kyn sakbornings: Karl.<br /><br />Krafist er gæsluvarðhalds til mánudagsins 12. ágúst 2030, kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Talsmaður sakbornings hefur ekki verið skráður.<br /><br />Málsnúmer héraðsdóms er R-1232/1233.',
    )
  })

  test('should format request for admission to facility', () => {
    // Arrange
    const caseType = CaseType.ADMISSION_TO_FACILITY
    const prosecutorOffice = 'Lögreglustjórinn á höfuðborgarsvæðinu'
    const court = 'Héraðsdómur Austurlands'
    const courtDate = new Date('2021-02-11T12:02')
    const accusedGender = Gender.MALE
    const requestedValidToDate = new Date('2030-08-12T08:25')
    const isolation = false
    const defenderName = undefined
    const isExtension = true
    const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON
    const courtCaseNumber = 'R-1232/1233'

    // Act
    const res = formatPrisonCourtDateEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      accusedGender,
      requestedValidToDate,
      isolation,
      defenderName,
      isExtension,
      sessionArrangements,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Lögreglustjórinn á höfuðborgarsvæðinu hefur sent kröfu um áframhaldandi vistunar á viðeignadi stofnun til Héraðsdóms Austurlands og verður málið tekið fyrir fimmtudaginn 11. febrúar 2021, kl. 12:02.<br /><br />Kyn sakbornings: Karl.<br /><br />Krafist er vistunar til mánudagsins 12. ágúst 2030, kl. 08:25.<br /><br />Ekki er farið fram á einangrun.<br /><br />Talsmaður sakbornings hefur ekki verið skráður.<br /><br />Málsnúmer héraðsdóms er R-1232/1233.',
    )
  })
})

describe('formatDefenderCourtDateEmailNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
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
      DefenderSubRole.DEFENDANT_DEFENDER,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br /><br />Málsnúmer: R-77/2021.<br /><br />Dómsalur: 101.<br /><br />Dómari: Judy.<br /><br />Dómritari: Robin.<br /><br />Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
    )
  })

  test('should format defender court date notification with referral to court', () => {
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
      DefenderSubRole.DEFENDANT_DEFENDER,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br /><br />Málsnúmer: R-77/2021.<br /><br />Dómsalur: 101.<br /><br />Dómari: Judy.<br /><br />Dómritari: Robin.<br /><br />Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
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
      DefenderSubRole.DEFENDANT_DEFENDER,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem talsmann sakbornings.<br /><br />Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br /><br />Málsnúmer: R-77/2021.<br /><br />Dómsalur: 101.<br /><br />Dómari: Judy.<br /><br />Dómritari: Robin.<br /><br />Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
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
      DefenderSubRole.DEFENDANT_DEFENDER,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br /><br />Málsnúmer: R-77/2021.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari: Judy.<br /><br />Dómritari: Robin.<br /><br />Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
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
      DefenderSubRole.DEFENDANT_DEFENDER,
    )

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram laugardaginn 19. desember 2020, kl. 10:19.<br /><br />Málsnúmer: R-77/2021.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari: Judy.<br /><br />Sækjandi: Áki Ákærandi (Lögreglan á Höfuðborgarsvæðinu).',
    )
  })
})

describe('formatDefenderCourtDateLinkEmailNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
  })

  test('should format defender court date link notification with RVG link', () => {
    // Arrange
    const court = 'Héraðsdómur Norðurlands'
    const courtCaseNumber = 'R-77/2021'
    const overviewUrl = 'https://example.com/overview'
    const requestSharedWithDefender = RequestSharedWithDefender.COURT_DATE

    // Act
    const res = formatDefenderCourtDateLinkEmailNotification({
      formatMessage,
      overviewUrl,
      court,
      courtCaseNumber,
      requestSharedWithDefender:
        requestSharedWithDefender === RequestSharedWithDefender.COURT_DATE,
      defenderSubRole: DefenderSubRole.DEFENDANT_DEFENDER,
    })

    // Assert
    expect(res).toBe(
      'Sækjandi hefur valið að deila kröfu með þér sem verjanda/talsmann sakbornings í máli R-77/2021.<br /><br />Þú getur nálgast gögn málsins á <a href="https://example.com/overview">yfirlitssíðu málsins í Réttarvörslugátt</a>.',
    )
  })

  test('should format defender court date no request link notification with RVG link', () => {
    // Arrange
    const court = 'Héraðsdómur Norðurlands'
    const courtCaseNumber = 'R-77/2021'
    const overviewUrl = 'https://example.com/overview'

    // Act
    const res = formatDefenderCourtDateLinkEmailNotification({
      formatMessage,
      overviewUrl,
      court,
      courtCaseNumber,
      defenderSubRole: DefenderSubRole.DEFENDANT_DEFENDER,
    })

    // Assert
    expect(res).toBe(
      'Héraðsdómur Norðurlands hefur skráð þig sem verjanda/talsmann sakbornings í máli R-77/2021.<br /><br />Þú getur nálgast yfirlit málsins á <a href="https://example.com/overview">yfirlitssíðu málsins í Réttarvörslugátt</a>.',
    )
  })
})

describe('formatCourtRevokedSmsNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
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

  test('should format revoked sms for investigation cases', () => {
    // Arrange
    const type = CaseType.BODY_SEARCH
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
      'Rannsóknarheimild afturkölluð. Sækjandi: Kiddi Kærari. Fyrirtökutími: 20.12.2021, kl. 11:30.',
    )
  })
})

describe('formatPrisonRevokedEmailNotification', () => {
  let formatMessage: FormatMessage
  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
  })

  test('should format revoked notification for custody', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const prosecutorOffice = 'Aðalsaksóknari'
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')
    const defenderName = 'Dóri'
    const isExtension = false
    const courtCaseNumber = 'R-2023-11'

    // Act
    const res = formatPrisonRevokedEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      defenderName,
      isExtension,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Aðalsaksóknari hefur afturkallað kröfu um gæsluvarðhald sem send var til Héraðsdóms Þingvalla og taka átti fyrir sunnudaginn 24. janúar 2021, kl. 08:15.<br /><br />Verjandi sakbornings: Dóri.<br /><br />Málsnúmer héraðsdóms er R-2023-11.',
    )
  })

  test('should format revoked notification for admission to facility', () => {
    // Arrange
    const caseType = CaseType.ADMISSION_TO_FACILITY
    const prosecutorOffice = 'Aðalsaksóknari'
    const court = 'Héraðsdómur Þingvalla'
    const courtDate = new Date('2021-01-24T08:15')
    const defenderName = 'Dóri'
    const isExtension = true
    const courtCaseNumber = 'R-2023-13'

    // Act
    const res = formatPrisonRevokedEmailNotification(
      formatMessage,
      caseType,
      prosecutorOffice,
      court,
      courtDate,
      defenderName,
      isExtension,
      courtCaseNumber,
    )

    // Assert
    expect(res).toBe(
      'Aðalsaksóknari hefur afturkallað kröfu um áframhaldandi vistun sem send var til Héraðsdóms Þingvalla og taka átti fyrir sunnudaginn 24. janúar 2021, kl. 08:15.<br /><br />Verjandi sakbornings: Dóri.<br /><br />Málsnúmer héraðsdóms er R-2023-13.',
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

describe('formatCustodyRestrictions', () => {
  const formatMessage = createTestIntl({
    locale: 'is',
    onError: jest.fn(),
  }).formatMessage

  const format = (
    caseType: CaseType,
    requestedRestrictions?: CaseCustodyRestrictions[],
    isCustodyIsolation?: boolean,
  ) =>
    formatCustodyRestrictions(
      formatMessage,
      caseType,
      requestedRestrictions,
      isCustodyIsolation,
    )

  test('should format custody without further restrictions', () => {
    const caseType = CaseType.CUSTODY
    const requestedRestrictions = [] as CaseCustodyRestrictions[]
    const isCustodyIsolation = false

    const result = format(caseType, requestedRestrictions, isCustodyIsolation)

    expect(result).toEqual(
      'Sækjandi tekur fram að gæsluvarðhaldið verði án takmarkana.',
    )
  })

  test('should format admission case without further restrictions', () => {
    // Arrange
    const caseType = CaseType.ADMISSION_TO_FACILITY
    const requestedRestrictions = [] as CaseCustodyRestrictions[]
    const isCustodyIsolation = false

    // Act
    const result = format(caseType, requestedRestrictions, isCustodyIsolation)

    // Assert
    expect(result).toEqual('Sækjandi tekur fram að vistun verði án takmarkana.')
  })

  test('should format custody with isolation, without further restrictions', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const requestedRestrictions = [] as CaseCustodyRestrictions[]
    const isCustodyIsolation = true

    // Act
    const result = format(caseType, requestedRestrictions, isCustodyIsolation)

    // Assert
    expect(result).toEqual(
      'Sækjandi tekur fram að gæsluvarðhaldið verði án annara takmarkana.',
    )
  })

  test('should return formatted restrictions for isolation and one other restriction', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const requestedRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]
    const isCustodyIsolation = false

    // Act
    const res = format(caseType, requestedRestrictions, isCustodyIsolation)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should return formatted message for admission cases with two additional restrictions', () => {
    // Arrange
    const caseType = CaseType.ADMISSION_TO_FACILITY
    const requestedRestrictions = [
      CaseCustodyRestrictions.COMMUNICATION,
      CaseCustodyRestrictions.MEDIA,
    ]
    const isCustodyIsolation = false

    // Act
    const res = format(caseType, requestedRestrictions, isCustodyIsolation)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að vistun verði með bréfaskoðun og símabanni og fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should return formatted restrictions for all but isolation', () => {
    // Arrange
    const caseType = CaseType.CUSTODY
    const requestedRestrictions = [
      CaseCustodyRestrictions.NECESSITIES,
      CaseCustodyRestrictions.WORKBAN,
      CaseCustodyRestrictions.COMMUNICATION,
    ]
    const isCustodyIsolation = false

    // Act
    const res = format(caseType, requestedRestrictions, isCustodyIsolation)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með banni við útvegun persónulegra nauðsynja, bréfaskoðun og símabanni og vinnubanni skv. 99. gr. laga nr. 88/2008.',
    )
  })
})

describe('formatPrisonAdministrationRulingNotification', () => {
  const formatMessage = createTestIntl({
    locale: 'is',
    onError: jest.fn(),
  }).formatMessage
  const fn = (
    isModifyingRuling: boolean,
    overviewUrl: string,
    courtCaseNumber?: string,
    courtName?: string,
  ) =>
    formatPrisonAdministrationRulingNotification(
      formatMessage,
      isModifyingRuling,
      overviewUrl,
      courtCaseNumber,
      courtName,
    )

  it('should format prison adminstration ruling notification', () => {
    const isModifyingRuling = false
    const courtCaseNumber = '007-2022-06546'
    const courtName = 'Héraðsdómur'
    const overviewUrl = 'some url'

    const result = fn(
      isModifyingRuling,
      overviewUrl,
      courtCaseNumber,
      courtName,
    )

    expect(result.subject).toBe('Úrskurður í máli 007-2022-06546')
    expect(result.body).toBe(
      'Dómari hefur undirritað og staðfest úrskurð í máli 007-2022-06546 hjá Héraðsdómi.<br /><br />Skjöl málsins eru aðgengileg á <a href="some url">yfirlitssíðu málsins í Réttarvörslugátt</a>.',
    )
  })
})

describe('formatDefenderResubmittedToCourtEmailNotification', () => {
  let formatMessage: FormatMessage

  beforeAll(() => {
    formatMessage = createTestIntl({
      locale: 'is',
      onError: jest.fn(),
    }).formatMessage
  })

  it('should format email', () => {
    const overviewUrl = 'https://rettarvorslugatt.island.is/overviewUrl'
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-2022/999'

    const result = formatDefenderResubmittedToCourtEmailNotification(
      formatMessage,
      overviewUrl,
      court,
      courtCaseNumber,
    )

    expect(result.body).toEqual(
      'Sækjandi í máli R-2022/999 hjá Héraðsdómi Reykjavíkur hefur breytt kröfunni og sent hana aftur á dóminn.<br /><br />Þú getur nálgast gögn málsins á <a href="https://rettarvorslugatt.island.is/overviewUrl">yfirlitssíðu málsins í Réttarvörslugátt</a>.',
    )
    expect(result.subject).toEqual('Krafa í máli R-2022/999')
  })
})

describe('filterWhitelistEmails', () => {
  const emails = [
    'test@rvg.is',
    'test2@rvg.is',
    'test3@rvg.is',
    'test4@example.com',
  ]

  it('should return only whitelisted emails', () => {
    const whitelist = `${emails[0]}, ${emails[2]}`
    const domainWhitelist = 'example.com'

    const result = filterWhitelistEmails(emails, domainWhitelist, whitelist)

    expect(result).toEqual([emails[0], emails[2], emails[3]])
  })

  it('should return empty array if no emails are whitelisted', () => {
    const whitelist = ''
    const domainWhitelist = ''

    const result = filterWhitelistEmails(emails, domainWhitelist, whitelist)

    expect(result).toEqual([])
  })
  it('should return domain whitelisted emails', () => {
    const whitelist = ''
    const domainWhitelist = 'rvg.is'

    const result = filterWhitelistEmails(emails, domainWhitelist, whitelist)

    expect(result).toEqual([emails[0], emails[1], emails[2]])
  })
})
