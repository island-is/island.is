import parseISO from 'date-fns/parseISO'
import addDays from 'date-fns/addDays'
import flatten from 'lodash/flatten'

import { TagVariant } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseCustodyRestrictions,
  CaseFileCategory,
  Feature,
  Gender,
  IndictmentSubtype,
  isCourtRole,
  Notification,
  NotificationType,
} from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'

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

export const getAppealEndDate = (courtEndTime: string) => {
  const courtEndTimeToDate = parseISO(courtEndTime)
  const appealEndDate = addDays(courtEndTimeToDate, 3)
  return formatDate(appealEndDate, 'PPPp')
}

export const isBusiness = (nationalId?: string) => {
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

export const isTrafficViolationCase = (
  workingCase: Case,
  features: Feature[],
  user?: User,
): boolean => {
  if (!workingCase.indictmentSubtypes) {
    return false
  }

  const flatIndictmentSubtypes = flatten(
    Object.values(workingCase.indictmentSubtypes),
  )

  return Boolean(
    (features.includes(Feature.INDICTMENT_ROUTE) ||
      user?.institution?.id === '26136a67-c3d6-4b73-82e2-3265669a36d3' || // Lögreglustjórinn á Suðurlandi
      user?.institution?.id === '53581d7b-0591-45e5-9cbe-c96b2f82da85' || // Lögreglustjórinn á höfuðborgarsvæðinu
      user?.name === 'Ásmundur Jónsson' ||
      (user && isCourtRole(user.role))) &&
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
