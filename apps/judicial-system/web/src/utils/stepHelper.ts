import addDays from 'date-fns/addDays'
import parseISO from 'date-fns/parseISO'
import flatten from 'lodash/flatten'

import { TagVariant } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  IndictmentSubtype,
  Notification,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  CaseCustodyRestrictions,
  CaseType,
  Gender,
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

export const kb = (bytes?: number) => {
  return bytes ? Math.ceil(bytes / 1024) : ''
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
  notifications?: Notification[],
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

  return notificationsOfType[0].recipients.some(
    (recipient) => recipient.success,
  )
}
