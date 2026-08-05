import { IntlShape } from 'react-intl'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseIndictmentRulingDecision,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './DefendantInfo.strings'

type VerdictTagVariant = 'darkerBlue' | 'purple' | 'blue' | 'rose' | 'mint'

type VerdictTagKey =
  | 'acquitted'
  | 'appealRequested'
  | 'defaultJudgement'
  | 'verdict'

type DefendantVerdictTagInput = {
  isAcquittedByPublicProsecutionOffice?: boolean | null
  defendantHasRequestedAppeal?: boolean | null
  isDefaultJudgement?: boolean | null
}

export type DefendantTagConfig = {
  label: string
  variant: VerdictTagVariant
  key?: VerdictTagKey
}

export const getAppealExpirationInfo = ({
  verdictAppealDeadline,
  isVerdictAppealDeadlineExpired,
  serviceRequirement,
}: {
  verdictAppealDeadline?: Date | string | null
  isVerdictAppealDeadlineExpired?: boolean | null
  serviceRequirement?: ServiceRequirement | null
}) => {
  if (serviceRequirement === ServiceRequirement.NOT_REQUIRED) {
    return { message: strings.serviceNotRequired, date: null }
  }

  if (!verdictAppealDeadline) {
    return { message: strings.appealDateNotBegun, date: null }
  }

  const expiryDate = new Date(verdictAppealDeadline)

  const message = isVerdictAppealDeadlineExpired
    ? strings.appealDateExpired
    : strings.appealExpirationDate

  return { message, date: formatDate(expiryDate) }
}

export const getVerdictViewDateText = (
  formatMessage: IntlShape['formatMessage'],
  verdictViewDate?: string | null,
): string => {
  if (verdictViewDate) {
    return formatMessage(strings.verdictDisplayedDate, {
      date: formatDate(verdictViewDate, 'PPP'),
    })
  } else {
    return formatMessage(strings.serviceRequired)
  }
}

export const getDefendantTagConfig = ({
  verdict,
  isPublicProsecutionOffice,
  indictmentRulingDecision,
}: {
  verdict?: DefendantVerdictTagInput | null
  isPublicProsecutionOffice: boolean
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null
}): DefendantTagConfig | null => {
  if (verdict) {
    if (
      verdict.isAcquittedByPublicProsecutionOffice &&
      isPublicProsecutionOffice
    ) {
      return {
        key: 'acquitted',
        label: 'Sýknudómur',
        variant: 'darkerBlue',
      }
    }

    if (verdict.defendantHasRequestedAppeal && isPublicProsecutionOffice) {
      return {
        key: 'appealRequested',
        label: 'Áfrýjunarleyfi',
        variant: 'darkerBlue',
      }
    }

    if (verdict.isDefaultJudgement) {
      return {
        key: 'defaultJudgement',
        label: 'Útivistardómur',
        variant: 'purple',
      }
    }

    return {
      key: 'verdict',
      label: 'Dómur',
      variant: 'darkerBlue',
    }
  }

  switch (indictmentRulingDecision) {
    case CaseIndictmentRulingDecision.DISMISSAL:
      return {
        label: 'Frávísun',
        variant: 'blue',
      }
    case CaseIndictmentRulingDecision.CANCELLATION:
      return {
        label: 'Niðurfelling',
        variant: 'rose',
      }
    case CaseIndictmentRulingDecision.FINE:
      return {
        label: 'Viðurlagaákvörðun',
        variant: 'mint',
      }
    case CaseIndictmentRulingDecision.WITHDRAWAL:
      return {
        label: 'Afturkallað',
        variant: 'rose',
      }
    case CaseIndictmentRulingDecision.MERGE:
      return {
        label: 'Sameinað',
        variant: 'rose',
      }
    default:
      return null
  }
}
