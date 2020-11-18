import {
  formatDate,
  formatNationalId,
  laws,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseGender,
} from '@island.is/judicial-system/types'

export function formatProsecutorDemands(
  accusedNationalId: string,
  accusedName: string,
  court: string,
  requestedCustodyEndDate: Date,
  isolation: boolean,
): string {
  return `Þess er krafist að ${accusedName} ${formatNationalId(
    accusedNationalId,
  )} verði með úrskurði ${court?.replace(
    'Héraðsdómur',
    'Héraðsdóms',
  )} gert að sæta gæsluvarðhaldi til ${formatDate(
    requestedCustodyEndDate,
    'PPPPp',
  )
    ?.replace('dagur,', 'dagsins')
    .replace(' kl.', ', kl.')}${
    isolation
      ? ' og verði gert að sæta einangrun meðan á gæsluvarðhaldi stendur'
      : ''
  }.`
}

export function formatCustodyProvisions(
  custodyProvisions: CaseCustodyProvisions[],
): string {
  return custodyProvisions
    ?.sort()
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
  rejecting: boolean,
  custodyEndDate: Date,
  isolation: boolean,
): string {
  return rejecting
    ? 'Beiðni um gæsluvarðhald hafnað.'
    : `Kærði, ${accusedName} ${formatNationalId(
        accusedNationalId,
      )} skal sæta gæsluvarðhaldi, þó ekki lengur en til ${formatDate(
        custodyEndDate,
        'PPPPp',
      )?.replace('dagur,', 'dagsins')}.${
        isolation
          ? ' Kærði skal sæta einangrun meðan á gæsluvarðhaldi stendur.'
          : ''
      }`
}

export function formatRestrictions(
  custodyRestrictions: CaseCustodyRestrictions[],
): string {
  if (!(custodyRestrictions?.length > 0)) {
    return 'Sækjandi tekur fram að gæsluvarðhaldið sé án takmarkana.'
  }

  let res = 'Sækjandi tekur fram að '

  if (custodyRestrictions.includes(CaseCustodyRestrictions.ISOLATION)) {
    res += 'kærði skuli sæta einangrun meðan á gæsluvarðhaldi stendur'

    if (custodyRestrictions.length === 1) {
      return res + '.'
    }

    res += ' og að '
  }

  const filteredCustodyRestrictions = custodyRestrictions
    .filter(
      (custodyRestriction) =>
        custodyRestriction !== CaseCustodyRestrictions.ISOLATION,
    )
    .sort()

  const filteredCustodyRestrictionsAsString = filteredCustodyRestrictions.reduce(
    (res, custodyRestriction, index) => {
      const isNextLast = index === filteredCustodyRestrictions.length - 2
      const isLast = index === filteredCustodyRestrictions.length - 1
      const isOnly = filteredCustodyRestrictions.length === 1

      return (res +=
        custodyRestriction === CaseCustodyRestrictions.COMMUNICATION
          ? `bréfaskoðun og símabanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : custodyRestriction === CaseCustodyRestrictions.MEDIA
          ? `fjölmiðlabanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : custodyRestriction === CaseCustodyRestrictions.VISITAION
          ? `heimsóknarbanni${
              isLast ? ' ' : isNextLast && !isOnly ? ' og ' : ', '
            }`
          : '')
    },
    '',
  )

  return `${res}gæsluvarðhaldið verði með ${filteredCustodyRestrictionsAsString}skv. 99. gr. laga nr. 88/2008.`
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
  const courtText = court.replace('dómur', 'dóms')
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
  rejecting: boolean,
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
    rejecting,
    custodyEndDate,
    custodyRestrictions.includes(CaseCustodyRestrictions.ISOLATION),
  )}<br /><br /><strong>Ákvörðun um kæru</strong><br />${formatAppeal(
    accusedAppealDecision,
    'Kærði',
    false,
  )}<br />${formatAppeal(
    prosecutorAppealDecision,
    'Sækjandi',
    false,
  )}<br /><br /><strong>Tilhögun gæsluvarðhalds</strong><br />${formatRestrictions(
    custodyRestrictions,
  )}<br /><br />${judgeName} ${judgeTitle}`
}

export function stripHtmlTags(html: string): string {
  return html.replace(/(?:<br \/>)/g, '\n').replace(/(?:<\/?strong>)/g, '')
}
