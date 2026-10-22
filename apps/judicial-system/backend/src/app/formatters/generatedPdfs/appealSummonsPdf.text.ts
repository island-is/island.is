import {
  applyGenitiveCaseToCourtName,
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

export const APPEAL_SUMMONS_TITLE = 'Áfrýjunarstefna'

export const APPEAL_SUMMONS_CLOSING_PROCEDURE =
  'Málið verður tekið til meðferðar fyrir Landsrétti í samræmi við tilkynningar sem rétturinn sendir á síðari stigum.'

export const formatAppealSummonsDefendantNames = (
  names: (string | undefined | null)[],
): string => {
  const listed = names.filter(
    (name): name is string =>
      name !== undefined && name !== null && name !== '',
  )

  if (listed.length === 0) {
    return ''
  }

  if (listed.length === 1) {
    return listed[0]
  }

  return `${listed.slice(0, -1).join(', ')} og ${listed[listed.length - 1]}`
}

export const formatAppealSummonsClosingPlaceAndDate = (date: Date): string =>
  `Skrifstofu ríkissaksóknara, Reykjavík, ${formatDate(date, 'PPP')}`

type AppealSummonsIntroInput = {
  appellantSide: AppealSummonsAppellantSide
  defendantName?: string | null
  defendantNationalId?: string | null
  defendantAddress?: string | null
  appealDate?: Date | string | null
  courtName?: string | null
  rulingDate?: Date | string | null
  courtCaseNumber?: string | null
  defendantNames: (string | undefined | null)[]
}

export const formatAppealSummonsIntro = ({
  appellantSide,
  defendantName,
  defendantNationalId,
  defendantAddress,
  appealDate,
  courtName,
  rulingDate,
  courtCaseNumber,
  defendantNames,
}: AppealSummonsIntroInput): string => {
  const courtGenitive = applyGenitiveCaseToCourtName(courtName || 'Héraðsdómur')
  const against = formatAppealSummonsDefendantNames(defendantNames)
  const caseAgainst = against ? `Ákæruvaldið gegn ${against}` : 'Ákæruvaldið'

  if (appellantSide === AppealSummonsAppellantSide.PROSECUTION) {
    return `Ríkissaksóknari gerir kunnugt: Að hann hefur ákveðið að áfrýja til Landsréttar dómi ${courtGenitive}, uppkveðnum ${formatDate(
      rulingDate,
      'PPP',
    )}, í málinu nr. ${courtCaseNumber}: ${caseAgainst}.`
  }

  return `Ríkissaksóknari gerir kunnugt: Ákærði, ${
    defendantName ?? ''
  }, kennitala ${formatNationalId(defendantNationalId)}, ${
    defendantAddress ?? ''
  }, hefur með yfirlýsingu ${formatDate(
    appealDate,
    'PPP',
  )} áfrýjað til Landsréttar dómi ${courtGenitive}, uppkveðnum ${formatDate(
    rulingDate,
    'PPP',
  )}, í málinu nr. ${courtCaseNumber}: ${caseAgainst}.`
}
