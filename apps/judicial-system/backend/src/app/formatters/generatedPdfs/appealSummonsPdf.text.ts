import {
  applyGenitiveCaseToCourtName,
  formatAppealDefendantNames,
  formatDate,
  formatNationalId,
  resolveAppealCaseName,
} from '@island.is/judicial-system/formatters'
import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

export const APPEAL_SUMMONS_TITLE = 'Áfrýjunarstefna'

export const APPEAL_SUMMONS_CLOSING_PROCEDURE =
  'Málið verður tekið til meðferðar fyrir Landsrétti í samræmi við tilkynningar sem rétturinn sendir á síðari stigum.'

export const formatAppealSummonsDefendantNames = formatAppealDefendantNames

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
  caseName?: string | null
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
  caseName,
}: AppealSummonsIntroInput): string => {
  const courtGenitive = applyGenitiveCaseToCourtName(courtName || 'Héraðsdómur')
  const caseAgainst = resolveAppealCaseName(caseName, defendantNames)

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
