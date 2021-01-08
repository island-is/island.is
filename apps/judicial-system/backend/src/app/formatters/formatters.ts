import {
  formatDate,
  formatNationalId,
  formatRestrictions,
  laws,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
} from '@island.is/judicial-system/types'

export function formatProsecutorDemands(
  accusedNationalId: string,
  accusedName: string,
  court: string,
  alternativeTravelBan: boolean,
  requestedCustodyEndDate: Date,
  isolation: boolean,
): string {
  return `Þess er krafist að ${accusedName} kt. ${formatNationalId(
    accusedNationalId,
  )} verði með úrskurði ${court?.replace(
    'Héraðsdómur',
    'Héraðsdóms',
  )} gert að sæta gæsluvarðhaldi${
    alternativeTravelBan ? ', farbanni til vara,' : ''
  } til ${formatDate(requestedCustodyEndDate, 'PPPPp')
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')}${
    isolation
      ? ' og verði gert að sæta einangrun meðan á gæsluvarðhaldi stendur'
      : ''
  }.`
}

function custodyProvisionsOrder(p: CaseCustodyProvisions) {
  switch (p) {
    case CaseCustodyProvisions._95_1_A:
      return 0
    case CaseCustodyProvisions._95_1_B:
      return 1
    case CaseCustodyProvisions._95_1_C:
      return 2
    case CaseCustodyProvisions._95_1_D:
      return 3
    case CaseCustodyProvisions._95_2:
      return 4
    case CaseCustodyProvisions._99_1_B:
      return 5
    case CaseCustodyProvisions._100_1:
      return 6
    default:
      return 999
  }
}

function custodyProvisionsCompare(
  p1: CaseCustodyProvisions,
  p2: CaseCustodyProvisions,
) {
  const o1 = custodyProvisionsOrder(p1)
  const o2 = custodyProvisionsOrder(p2)

  return o1 < o2 ? -1 : o1 > o2 ? 1 : 0
}

export function formatCustodyProvisions(
  custodyProvisions: CaseCustodyProvisions[],
): string {
  return custodyProvisions
    ?.sort((p1, p2) => custodyProvisionsCompare(p1, p2))
    .reduce((s, l) => `${s}${laws[l]}\n`, '')
    .slice(0, -1)
}

export function formatCourtCaseNumber(
  court: string,
  courtCaseNumber: string,
): string {
  return `Málsnúmer ${court?.replace(
    'Héraðsdómur',
    'Héraðsdóms',
  )} ${courtCaseNumber}`
}

export function formatConclusion(
  accusedNationalId: string,
  accusedName: string,
  decision: CaseDecision,
  custodyEndDate: Date,
  isolation: boolean,
): string {
  return decision === CaseDecision.REJECTING
    ? 'Kröfu um gæsluvarðhald er hafnað.'
    : `Kærði, ${accusedName}, kt. ${formatNationalId(
        accusedNationalId,
      )}, skal sæta ${
        decision === CaseDecision.ACCEPTING ? 'gæsluvarðhaldi' : 'farbanni'
      }, þó ekki lengur en til ${formatDate(custodyEndDate, 'PPPPp')?.replace(
        'dagur,',
        'dagsins',
      )}.${
        decision === CaseDecision.ACCEPTING && isolation
          ? ' Kærði skal sæta einangrun meðan á gæsluvarðhaldi stendur.'
          : ''
      }`
}

export function formatAppeal(
  appealDecision: CaseAppealDecision,
  stakeholder: string,
  includeBullet = true,
): string {
  switch (appealDecision) {
    case CaseAppealDecision.APPEAL:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} kærir úrskurðinn.`
    case CaseAppealDecision.ACCEPT:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} unir úrskurðinum.`
    case CaseAppealDecision.POSTPONE:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} tekur sér lögboðinn frest.`
  }
}

export function formatHeadsUpSmsNotification(
  prosecutorName: string,
  arrestDate: Date,
  requestedCourtDate: Date,
): string {
  // Prosecutor
  const prosecutorText = ` Ákærandi: ${prosecutorName}.`

  // Arrest date
  const arrestDateText = arrestDate
    ? ` Viðkomandi handtekinn ${formatDate(arrestDate, 'Pp').replace(
        ' ',
        ' kl. ',
      )}.`
    : ''

  // Court date
  const requestedCourtDateText = requestedCourtDate
    ? ` ÓE fyrirtöku ${formatDate(requestedCourtDate, 'Pp').replace(
        ' ',
        ' eftir kl. ',
      )}.`
    : ''

  return `Ný gæsluvarðhaldskrafa í vinnslu.${prosecutorText}${arrestDateText}${requestedCourtDateText}`
}

export function formatReadyForCourtSmsNotification(
  prosecutorName: string,
  court: string,
) {
  // Prosecutor
  const prosecutorText = ` Ákærandi: ${prosecutorName}.`

  // Court
  const courtText = ` Dómstóll: ${court}.`

  return `Gæsluvarðhaldskrafa tilbúin til afgreiðslu.${prosecutorText}${courtText}`
}

export function formatProsecutorCourtDateEmailNotification(
  court: string,
  courtDate: Date,
  courtRoom: string,
  defenderName: string,
): string {
  const courtDateText = formatDate(courtDate, 'PPPp')
  const defenderText = defenderName
    ? `Verjandi sakbornings: ${defenderName}`
    : 'Verjandi sakbornings hefur ekki verið skráður'

  return `${court} hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram ${courtDateText}.<br /><br />Dómsalur: ${courtRoom}.<br /><br />${defenderText}.`
}

export function formatPrisonCourtDateEmailNotification(
  court: string,
  courtDate: Date,
  accusedGender: CaseGender,
  requestedCustodyEndDate: Date,
  isolation: boolean,
  defenderName: string,
): string {
  const courtText = court?.replace('dómur', 'dóms')
  const courtDateText = formatDate(courtDate, 'PPPp')
  const requestedCustodyEndDateText = formatDate(
    requestedCustodyEndDate,
    'PPPp',
  )
  const requestText =
    accusedGender === CaseGender.OTHER
      ? `Krafist er gæsluvarðhalds til ${requestedCustodyEndDateText}.`
      : `Sakborningur er ${
          accusedGender === CaseGender.MALE ? 'karl' : 'kona'
        } og krafist er gæsluvarðhalds til ${requestedCustodyEndDateText}.`
  const isolationText = isolation
    ? 'Farið er fram á einangrun.'
    : 'Ekki er farið fram á einangrun.'
  const defenderText = defenderName
    ? `Verjandi sakbornings: ${defenderName}`
    : 'Verjandi sakbornings hefur ekki verið skráður'

  return `Krafa um gæsluvarðhald hefur verið send til ${courtText} og verður málið tekið fyrir ${courtDateText}.<br /><br />${requestText}<br /><br />${isolationText}<br /><br />${defenderText}.`
}

export function formatDefenderCourtDateEmailNotification(
  accusedNationalId: string,
  accusedName: string,
  court: string,
  courtDate: Date,
  courtRoom: string,
): string {
  return `${court} hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram ${formatDate(
    courtDate,
    'PPPp',
  )}.<br /><br />Dómsalur: ${courtRoom}.<br /><br />Sakborningur: ${accusedName} ${formatNationalId(
    accusedNationalId,
  )}.<br /><br />Dómstóllinn hefur skráð þig sem verjanda sakbornings.`
}

export function formatCourtDateNotificationCondition(
  courtDate: Date,
  defenderEmail: string,
): string {
  return `courtDate=${formatDate(
    courtDate,
    'Pp',
  )},defenderEmail=${defenderEmail}`
}

export function formatPrisonRulingEmailNotification(
  accusedNationalId: string,
  accusedName: string,
  court: string,
  prosecutorName: string,
  courtDate: Date,
  defenderName: string,
  decision: CaseDecision,
  custodyEndDate: Date,
  custodyRestrictions: CaseCustodyRestrictions[],
  accusedAppealDecision: CaseAppealDecision,
  prosecutorAppealDecision: CaseAppealDecision,
  judgeName: string,
  judgeTitle: string,
): string {
  return `<strong>Úrskurður um gæsluvarðhald</strong><br /><br />${court}, ${formatDate(
    courtDate,
    'PPP',
  )}.<br /><br />Ákærandi: ${prosecutorName}<br />Verjandi: ${defenderName}<br /><br /><strong>Úrskurðarorð</strong><br /><br />${formatConclusion(
    accusedNationalId,
    accusedName,
    decision,
    custodyEndDate,
    custodyRestrictions.includes(CaseCustodyRestrictions.ISOLATION),
  )}<br /><br /><strong>Ákvörðun um kæru</strong><br />${formatAppeal(
    accusedAppealDecision,
    'Kærði',
    false,
  )}<br />${formatAppeal(prosecutorAppealDecision, 'Sækjandi', false)}${
    decision === CaseDecision.ACCEPTING
      ? `<br /><br /><strong>Tilhögun gæsluvarðhalds</strong><br />${formatRestrictions(
          custodyRestrictions,
        )}`
      : ''
  }<br /><br />${judgeName} ${judgeTitle}`
}

export function stripHtmlTags(html: string): string {
  return html.replace(/(?:<br \/>)/g, '\n').replace(/(?:<\/?strong>)/g, '')
}
