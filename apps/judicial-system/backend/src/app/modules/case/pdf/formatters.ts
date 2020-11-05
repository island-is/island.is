import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'

import { Case } from '../models'

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
  )?.replace('dagur,', 'dagsins')}${
    isolation
      ? ' og verði gert að sæta einangrun meðan á gæsluvarðhaldi stendur'
      : ''
  }.`
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

export function formatConclusion(existingCase: Case): string {
  return existingCase.rejecting
    ? 'Beiðni um gæsluvarðhald hafnað.'
    : `Kærði, ${existingCase.accusedName} kt.${
        existingCase.accusedNationalId
      } skal sæta gæsluvarðhaldi, þó ekki lengur en til ${formatDate(
        existingCase.custodyEndDate,
        'PPPp',
      )}.${
        existingCase.custodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        )
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
) {
  switch (appealDecision) {
    case CaseAppealDecision.APPEAL:
      return `  \u2022  ${stakeholder} kærir úrskurðinn.`
    case CaseAppealDecision.ACCEPT:
      return `  \u2022  ${stakeholder} unir úrskurðinum.`
    case CaseAppealDecision.POSTPONE:
      return `  \u2022  ${stakeholder} tekur sér lögboðinn frest.`
  }
}
