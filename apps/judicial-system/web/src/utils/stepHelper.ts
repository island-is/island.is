import addDays from 'date-fns/addDays'
import parseISO from 'date-fns/parseISO'
import flatten from 'lodash/flatten'

import { TagVariant } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { IndictmentSubtype } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseCustodyRestrictions,
  CaseFileCategory,
  CaseType,
  Gender,
  Notification,
  NotificationType,
  DefendantPlea,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

export const getShortGender = (gender?: Gender): string => {
  switch (gender) {
    case Gender.MALE: {
      return 'kk'
    }
    case Gender.FEMALE: {
      return 'kvk'
    }
    case Gender.OTHER: {
      return 'annað'
    }
    default: {
      return ''
    }
  }
}

export const getRestrictionTagVariant = (
  restriction: CaseCustodyRestrictions,
): TagVariant => {
  switch (restriction) {
    case CaseCustodyRestrictions.COMMUNICATION: {
      return 'rose'
    }
    case CaseCustodyRestrictions.ISOLATION: {
      return 'red'
    }
    case CaseCustodyRestrictions.MEDIA:
    case CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION: {
      return 'blueberry'
    }
    case CaseCustodyRestrictions.VISITAION: {
      return 'purple'
    }
    default: {
      return 'darkerBlue'
    }
  }
}

export const fileSize = (bytes?: number) => {
  if (!bytes) return ''

  const kb = Math.ceil(bytes / 1024)
  return kb >= 10000 ? `${kb.toString().substring(0, 2)}MB` : `${kb}KB`
}

export const getAppealEndDate = (rulingDate: string) => {
  const appealEndDate = addDays(parseISO(rulingDate), 3)
  return formatDate(appealEndDate, 'PPPp')
}

export const isBusiness = (nationalId?: string | null) => {
  if (!nationalId) {
    return false
  }

  return parseInt(nationalId.slice(0, 2)) > 31
}

export const createCaseResentExplanation = (
  workingCase: Case,
  explanation?: string,
) => {
  const now = new Date()

  return `${
    workingCase.caseResentExplanation
      ? `${workingCase.caseResentExplanation}<br/><br/>`
      : ''
  }Krafa endursend ${formatDate(now, 'PPPp')} - ${explanation}`
}

export const isTrafficViolationCase = (workingCase: Case): boolean => {
  if (
    !workingCase.indictmentSubtypes ||
    workingCase.type !== CaseType.INDICTMENT
  ) {
    return false
  }

  const flatIndictmentSubtypes = flatten(
    Object.values(workingCase.indictmentSubtypes),
  )

  return Boolean(
    !(
      workingCase.caseFiles &&
      workingCase.caseFiles.find(
        (file) => file.category === CaseFileCategory.INDICTMENT,
      )
    ) &&
      flatIndictmentSubtypes.length > 0 &&
      flatIndictmentSubtypes.every(
        (val) => val === IndictmentSubtype.TRAFFIC_VIOLATION,
      ),
  )
}

export const hasSentNotification = (
  notificationType: NotificationType,
  notifications?: Notification[] | null,
) => {
  if (!notifications || notifications.length === 0) {
    return false
  }

  const notificationsOfType = notifications.filter(
    (notification) => notification.type === notificationType,
  )

  if (notificationsOfType.length === 0) {
    return false
  }

  return Boolean(
    notificationsOfType[0].recipients?.some((recipient) => recipient.success),
  )
}

export const isReopenedCOACase = (
  appealState?: CaseAppealState | null,
  notifications?: Notification[] | null,
): boolean => {
  return (
    appealState !== CaseAppealState.COMPLETED &&
    hasSentNotification(NotificationType.APPEAL_COMPLETED, notifications)
  )
}

export const getDefendantPleaText = (defendantPlea?: DefendantPlea) => {
  switch (defendantPlea) {
    case DefendantPlea.GUILTY:
      return 'Játar sök'
    case DefendantPlea.NOT_GUILTY:
      return 'Neitar sök'
    case DefendantPlea.NO_PLEA:
      return 'Tjáir sig ekki / óljóst'
    default:
      return ''
  }
}
