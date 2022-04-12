import {
  formatDate,
  formatNationalId,
  laws,
  formatGender,
  caseTypes,
} from '@island.is/judicial-system/formatters'
import {
  CaseLegalProvisions,
  CaseType,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import type { Gender } from '@island.is/judicial-system/types'

function legalProvisionsOrder(p: CaseLegalProvisions) {
  switch (p) {
    case CaseLegalProvisions._95_1_A:
      return 0
    case CaseLegalProvisions._95_1_B:
      return 1
    case CaseLegalProvisions._95_1_C:
      return 2
    case CaseLegalProvisions._95_1_D:
      return 3
    case CaseLegalProvisions._95_2:
      return 4
    case CaseLegalProvisions._99_1_B:
      return 6
    case CaseLegalProvisions._100_1:
      return 7
    default:
      return 999
  }
}

function legalProvisionsCompare(
  p1: CaseLegalProvisions,
  p2: CaseLegalProvisions,
) {
  const o1 = legalProvisionsOrder(p1)
  const o2 = legalProvisionsOrder(p2)

  return o1 < o2 ? -1 : o1 > o2 ? 1 : 0
}

export function formatLegalProvisions(
  legalProvisions?: CaseLegalProvisions[],
  legalBasis?: string,
): string {
  const list = legalProvisions
    ?.sort((p1, p2) => legalProvisionsCompare(p1, p2))
    .reduce((s, l) => `${s}${laws[l]}\n`, '')
    .slice(0, -1)

  return list
    ? legalBasis
      ? `${list}\n${legalBasis}`
      : list
    : legalBasis
    ? legalBasis
    : 'Lagaákvæði ekki skráð'
}

export function formatCourtHeadsUpSmsNotification(
  type: CaseType,
  prosecutorName?: string,
  arrestDate?: Date,
  requestedCourtDate?: Date,
): string {
  // Prosecutor
  const prosecutorText = ` Sækjandi: ${prosecutorName ?? 'Ekki skráður'}.`

  // Arrest date
  const arrestDateText = arrestDate
    ? ` Viðkomandi handtekinn ${formatDate(arrestDate, 'Pp')?.replace(
        ' ',
        ', kl. ',
      )}.`
    : ''

  // Court date
  const requestedCourtDateText = requestedCourtDate
    ? ` ÓE fyrirtöku ${formatDate(requestedCourtDate, 'Pp')?.replace(
        ' ',
        ', eftir kl. ',
      )}.`
    : ''

  const newCaseText = `Ný ${
    type === CaseType.CUSTODY
      ? 'gæsluvarðhaldskrafa'
      : type === CaseType.TRAVEL_BAN
      ? 'farbannskrafa'
      : type === CaseType.OTHER
      ? 'krafa um rannsóknarheimild'
      : `krafa um rannsóknarheimild (${caseTypes[type]})`
  } í vinnslu.`

  return `${newCaseText}${prosecutorText}${arrestDateText}${requestedCourtDateText}`
}

export function formatCourtReadyForCourtSmsNotification(
  type: CaseType,
  prosecutorName?: string,
  court?: string,
): string {
  const submittedCaseText =
    type === CaseType.CUSTODY
      ? 'Gæsluvarðhaldskrafa'
      : type === CaseType.TRAVEL_BAN
      ? 'Farbannskrafa'
      : type === CaseType.OTHER
      ? 'Krafa um rannsóknarheimild'
      : `Krafa um rannsóknarheimild (${caseTypes[type]})`
  const prosecutorText = ` Sækjandi: ${prosecutorName ?? 'Ekki skráður'}.`
  const courtText = ` Dómstóll: ${court ?? 'Ekki skráður'}.`

  return `${submittedCaseText} tilbúin til afgreiðslu.${prosecutorText}${courtText}`
}

export function formatCourtResubmittedToCourtSmsNotification(
  courtCaseNumber?: string,
) {
  return `Sækjandi í máli ${courtCaseNumber} hefur breytt kröfunni og sent aftur á héraðsdómstól. Nýtt kröfuskjal hefur verið vistað í Auði.`
}

export function formatProsecutorReceivedByCourtSmsNotification(
  type: CaseType,
  court?: string,
  courtCaseNumber?: string,
): string {
  const receivedCaseText = isRestrictionCase(type)
    ? `${caseTypes[type]}`
    : type === CaseType.OTHER
    ? 'rannsóknarheimild'
    : `rannsóknarheimild (${caseTypes[type]})`

  return `${court} hefur móttekið kröfu um ${receivedCaseText} sem þú sendir og úthlutað málsnúmerinu ${courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is.`
}

export function formatProsecutorCourtDateEmailNotification(
  type: CaseType,
  court?: string,
  courtDate?: Date,
  courtRoom?: string,
  judgeName?: string,
  registrarName?: string,
  defenderName?: string,
  sessionArrangements?: SessionArrangements,
): string {
  const scheduledCaseText =
    type === CaseType.CUSTODY
      ? 'gæsluvarðhaldskröfu'
      : type === CaseType.TRAVEL_BAN
      ? 'farbannskröfu'
      : type === CaseType.OTHER
      ? 'kröfu um rannsóknarheimild'
      : `kröfu um rannsóknarheimild (${caseTypes[type]})`
  const courtDateText = formatDate(courtDate, 'PPPp')?.replace(' kl.', ', kl.')
  const courtRoomText = courtRoom
    ? `Dómsalur: ${courtRoom}`
    : 'Dómsalur hefur ekki verið skráður'
  const judgeText = judgeName
    ? `Dómari: ${judgeName}`
    : 'Dómari hefur ekki verið skráður'
  const registrarText = registrarName
    ? `<br /><br />Dómritari: ${registrarName}.`
    : ''
  const defenderText =
    sessionArrangements === SessionArrangements.PROSECUTOR_PRESENT
      ? ''
      : defenderName
      ? `<br /><br />${
          sessionArrangements === SessionArrangements.ALL_PRESENT_SPOKESPERSON
            ? 'Talsmaður'
            : 'Verjandi'
        } sakbornings: ${defenderName}.`
      : `<br /><br />${
          sessionArrangements === SessionArrangements.ALL_PRESENT_SPOKESPERSON
            ? 'Talsmaður'
            : 'Verjandi'
        } sakbornings hefur ekki verið skráður.`

  return `${court} hefur staðfest fyrirtökutíma fyrir ${scheduledCaseText}.<br /><br />Fyrirtaka mun fara fram ${courtDateText}.<br /><br />${courtRoomText}.<br /><br />${judgeText}.${registrarText}${defenderText}`
}

export function formatPrisonCourtDateEmailNotification(
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  accusedName?: string,
  accusedGender?: Gender,
  requestedValidToDate?: Date,
  isolation?: boolean,
  defenderName?: string,
  isExtension?: boolean,
  sessionArrangements?: SessionArrangements,
): string {
  const courtText = court?.replace('dómur', 'dóms') ?? 'ótilgreinds dómstóls'
  const courtDateText =
    formatDate(courtDate, 'PPPPp')
      ?.replace('dagur,', 'daginn')
      ?.replace(' kl.', ', kl.') ?? 'á ótilgreindum tíma'
  const requestedValidToDateText =
    formatDate(requestedValidToDate, 'PPPPp')
      ?.replace('dagur,', 'dagsins')
      ?.replace(' kl.', ', kl.') ?? 'ótilgreinds tíma'
  const requestText = `Nafn sakbornings: ${
    accusedName ?? 'Ekki skráð'
  }.<br /><br />Kyn sakbornings: ${formatGender(
    accusedGender,
  )}.<br /><br />Krafist er gæsluvarðhalds til ${requestedValidToDateText}.`
  const isolationText = isolation
    ? 'Farið er fram á einangrun.'
    : 'Ekki er farið fram á einangrun.'
  const defenderText = defenderName
    ? `${
        sessionArrangements === SessionArrangements.ALL_PRESENT_SPOKESPERSON
          ? 'Talsmaður'
          : 'Verjandi'
      } sakbornings: ${defenderName}`
    : `${
        sessionArrangements === SessionArrangements.ALL_PRESENT_SPOKESPERSON
          ? 'Talsmaður'
          : 'Verjandi'
      } sakbornings hefur ekki verið skráður`

  return `${prosecutorOffice ?? 'Ótilgreindur sækjandi'} hefur sent kröfu um ${
    isExtension ? 'áframhaldandi ' : ''
  }gæsluvarðhald til ${courtText} og verður málið tekið fyrir ${courtDateText}.<br /><br />${requestText}<br /><br />${isolationText}<br /><br />${defenderText}.`
}

export function formatDefenderCourtDateEmailNotification(
  court?: string,
  courtCaseNumber?: string,
  courtDate?: Date,
  courtRoom?: string,
  judgeName?: string,
  registrarName?: string,
  prosecutorName?: string,
  prosecutorInstitution?: string,
  sessionArrangements?: SessionArrangements,
): string {
  return `${court} hefur boðað þig í fyrirtöku sem ${
    sessionArrangements === SessionArrangements.ALL_PRESENT_SPOKESPERSON
      ? 'talsmann'
      : 'verjanda'
  } sakbornings.<br /><br />Fyrirtaka mun fara fram ${formatDate(
    courtDate,
    'PPPPp',
  )
    ?.replace('dagur,', 'daginn')
    ?.replace(
      ' kl.',
      ', kl.',
    )}.<br /><br />Málsnúmer: ${courtCaseNumber}.<br /><br />${
    courtRoom ? `Dómsalur: ${courtRoom}` : 'Dómsalur hefur ekki verið skráður'
  }.<br /><br />Dómari: ${judgeName}.${
    registrarName ? `<br /><br />Dómritari: ${registrarName}.` : ''
  }<br /><br />Sækjandi: ${prosecutorName} (${prosecutorInstitution}).`
}

// This function is only intended for case type CUSTODY
export function formatPrisonRulingEmailNotification(
  courtEndTime?: Date,
): string {
  return `Meðfylgjandi er vistunarseðill gæsluvarðhaldsfanga sem var úrskurðaður í gæsluvarðhald í héraðsdómi ${formatDate(
    courtEndTime,
    'PPP',
  )}, auk þingbókar þar sem úrskurðarorðin koma fram.`
}

export function formatCourtRevokedSmsNotification(
  type: CaseType,
  prosecutorName?: string,
  requestedCourtDate?: Date,
  courtDate?: Date,
) {
  // Prosecutor
  const prosecutorText = ` Sækjandi: ${prosecutorName ?? 'Ekki skráður'}.`

  // Court date
  const courtDateText = courtDate
    ? ` Fyrirtökutími: ${formatDate(courtDate, 'Pp')?.replace(' ', ', kl. ')}.`
    : requestedCourtDate
    ? ` ÓVE fyrirtöku ${formatDate(requestedCourtDate, 'Pp')?.replace(
        ' ',
        ', eftir kl. ',
      )}.`
    : ''

  return `${
    type === CaseType.CUSTODY ? 'Gæsluvarðhaldskrafa' : 'Farbannskrafa'
  } afturkölluð.${prosecutorText}${courtDateText}`
}

export function formatPrisonRevokedEmailNotification(
  prosecutorOffice?: string,
  court?: string,
  courtDate?: Date,
  accusedName?: string,
  defenderName?: string,
  isExtension?: boolean,
): string {
  const courtText = court?.replace('dómur', 'dóms') ?? 'ótilgreinds dómstóls'
  const courtDateText =
    formatDate(courtDate, 'PPPPp')
      ?.replace('dagur,', 'daginn')
      ?.replace(' kl.', ', kl.') ?? 'á ótilgreindum tíma'
  const accusedNameText = `Nafn sakbornings: ${accusedName ?? 'Ekki skráð'}.`
  const defenderText = defenderName
    ? `Verjandi sakbornings: ${defenderName}`
    : 'Verjandi sakbornings hefur ekki verið skráður'

  return `${
    prosecutorOffice ?? 'Ótilgreindur sækjandi'
  } hefur afturkallað kröfu um ${
    isExtension ? 'áframhaldandi ' : ''
  }gæsluvarðhald sem send var til ${courtText} og taka átti fyrir ${courtDateText}.<br /><br />${accusedNameText}<br /><br />${defenderText}.`
}

export function formatDefenderRevokedEmailNotification(
  type: CaseType,
  defendantNationalId?: string,
  defendantName?: string,
  defendantNoNationalId?: boolean,
  court?: string,
  courtDate?: Date,
): string {
  const courtText = court?.replace('dómur', 'dómi')
  const courtDateText = formatDate(courtDate, 'PPPPp')
    ?.replace('dagur,', 'daginn')
    ?.replace(' kl.', ', kl.')

  return `${
    type === CaseType.CUSTODY
      ? 'Gæsluvarðhaldskrafa'
      : type === CaseType.TRAVEL_BAN
      ? 'Farbannskrafa'
      : 'Krafa um rannsóknarheimild'
  } sem taka átti fyrir hjá ${courtText} ${courtDateText}, hefur verið afturkölluð.<br /><br />Sakborningur: ${
    defendantName ?? 'Nafn ekki skráð'
  }${
    defendantNoNationalId
      ? defendantNationalId
        ? `, fd. ${defendantNationalId}`
        : ''
      : `, kt. ${formatNationalId(defendantNationalId ?? 'ekki skráð')}`
  }.<br /><br />Dómstóllinn hafði skráð þig sem verjanda sakbornings.`
}

export function stripHtmlTags(html: string): string {
  return html
    .replace(/(?:<br \/>)/g, '\n')
    .replace(/(?:<\/?strong>)/g, '')
    .replace(/(?:<a href=".*">)/g, '')
    .replace(/(?:<\/a>)/g, '')
}
