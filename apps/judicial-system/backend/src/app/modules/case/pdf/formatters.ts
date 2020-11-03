import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'

import { Case } from '../models'

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
          ? ' Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.'
          : ''
      }`
}

export function formatRestrictions(existingCase: Case): string {
  const restrictions = existingCase.custodyRestrictions?.filter(
    (custodyRestriction) =>
      custodyRestriction !== CaseCustodyRestrictions.ISOLATION,
  )

  return `Sækjandi tekur fram að ${
    restrictions?.length > 0
      ? `kærði skuli sæta ${restrictions.map((custodyRestriction, index) => {
          const isNextLast = index === restrictions.length - 2
          const isLast = index === restrictions.length - 1
          const isOnly = restrictions.length === 1

          return custodyRestriction === CaseCustodyRestrictions.COMMUNICATION
            ? `bréfa, og símabanni${
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
            : ''
        })}á meðan á gæsluvarðhaldinu stendur.`
      : 'gæsluvarðhaldið sé án takmarkana.'
  }`
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

export function formatCourtCaseNumber(
  court: string,
  courtCaseNumber: string,
): string {
  return `Málsnúmer ${court?.replace(
    'Héraðsdómur',
    'Héraðsdóms',
  )} ${courtCaseNumber}`
}
