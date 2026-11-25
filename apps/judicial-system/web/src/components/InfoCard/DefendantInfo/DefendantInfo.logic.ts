import type { IntlShape } from 'react-intl'

import { formatDate } from '@island.is/judicial-system/formatters'
import type { InstitutionUser } from '@island.is/judicial-system/types'
import {
  isCourtOfAppealsUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
} from '@island.is/judicial-system/types'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { Advocate } from '@island.is/judicial-system-web/src/utils/appealAdvocate'
import { getAppealDefender } from '@island.is/judicial-system-web/src/utils/appealAdvocate'

import { strings } from './DefendantInfo.strings'

type VerdictTagVariant = 'darkerBlue' | 'purple' | 'blue' | 'rose' | 'mint'

type VerdictTagKey =
  | 'acquitted'
  | 'appealRequested'
  | 'defaultJudgement'
  | 'verdict'
  | 'closedWithoutEnforcement'

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

const asMessageDescriptor = (message: string) => ({
  id: message,
  defaultMessage: message,
})

/**
 * Court of appeals, public prosecution office staff, and public prosecutors
 * work the appeal proceeding. On the info card they should see the appeal
 * defender when one is recorded, not the district-court defender of record.
 */
export const prefersAppealDefenderOnInfoCard = (
  user?: InstitutionUser,
): boolean =>
  isCourtOfAppealsUser(user) ||
  isPublicProsecutionOfficeUser(user) ||
  isPublicProsecutionUser(user)

export const getInfoCardDefender = (
  defendant: Defendant,
  {
    user,
    fallback,
  }: {
    user?: InstitutionUser
    fallback?: Pick<Advocate, 'name' | 'email' | 'phoneNumber'>
  } = {},
): Pick<Advocate, 'name' | 'email' | 'phoneNumber'> => {
  if (prefersAppealDefenderOnInfoCard(user)) {
    return getAppealDefender(defendant)
  }

  return {
    name: defendant.defenderName || fallback?.name,
    email: defendant.defenderEmail || fallback?.email,
    phoneNumber: defendant.defenderPhoneNumber || fallback?.phoneNumber,
  }
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
    return {
      message: asMessageDescriptor(strings.serviceNotRequired),
      date: null,
    }
  }

  if (!verdictAppealDeadline) {
    return {
      message: asMessageDescriptor(strings.appealDateNotBegun),
      date: null,
    }
  }

  const expiryDate = new Date(verdictAppealDeadline)

  const message = isVerdictAppealDeadlineExpired
    ? strings.appealDateExpired
    : strings.appealExpirationDate

  return {
    message: asMessageDescriptor(message),
    date: formatDate(expiryDate),
  }
}

export const getVerdictViewDateText = (
  formatMessage: IntlShape['formatMessage'],
  verdictViewDate?: string | null,
): string => {
  if (verdictViewDate) {
    return formatMessage(
      {
        id: strings.verdictDisplayedDate,
        defaultMessage: strings.verdictDisplayedDate,
      },
      {
        date: formatDate(verdictViewDate, 'PPP'),
      },
    )
  } else {
    return strings.serviceRequired
  }
}

export const getDefendantTagConfig = ({
  verdict,
  isPublicProsecutionOffice,
  indictmentRulingDecision,
  isClosedWithoutEnforcement,
}: {
  verdict?: DefendantVerdictTagInput | null
  isPublicProsecutionOffice: boolean
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null
  isClosedWithoutEnforcement?: boolean | null
}): DefendantTagConfig | null => {
  if (isClosedWithoutEnforcement && isPublicProsecutionOffice) {
    return {
      key: 'closedWithoutEnforcement',
      label: 'Lokið',
      variant: 'rose',
    }
  }

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
