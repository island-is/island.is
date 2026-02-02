import { TagVariant } from '@island.is/island-ui/core'
import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import { isProsecutionUser } from '@island.is/judicial-system/types'
import {
  Case,
  CaseAppealState,
  CaseCustodyRestrictions,
  CivilClaimant,
  Defendant,
  DefendantPlea,
  Gender,
  Notification,
  NotificationType,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

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

export const fileSize = (bytes: number) => {
  const kb = Math.ceil(bytes / 1024)
  return kb >= 10000 ? `${kb.toString().substring(0, 2)}MB` : `${kb}KB`
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
  const now = new Date() // TODO: Find a way to set this message server side as we cannot trust the client date.

  return `${
    workingCase.caseResentExplanation
      ? `${workingCase.caseResentExplanation}<br/><br/>`
      : ''
  }Krafa endursend ${formatDate(now, 'PPPp')} - ${explanation}`
}

export const hasSentNotification = (
  notificationType: NotificationType,
  notifications?: Notification[] | null,
) => {
  if (!notifications || notifications.length === 0) {
    return { hasSent: false, date: null }
  }

  const notificationsOfType = notifications.filter(
    (notification) => notification.type === notificationType,
  )

  if (notificationsOfType.length === 0) {
    return { hasSent: false, date: null }
  }

  return {
    hasSent: Boolean(
      notificationsOfType[0].recipients?.some((recipient) => recipient.success),
    ),
    date: notificationsOfType[0].created,
  }
}

export const isReopenedCOACase = (
  appealState?: CaseAppealState | null,
  notifications?: Notification[] | null,
): boolean => {
  return (
    appealState !== CaseAppealState.COMPLETED &&
    hasSentNotification(NotificationType.APPEAL_COMPLETED, notifications)
      .hasSent
  )
}

export const getDefendantPleaText = (
  defendantName?: string | null,
  defendantPlea?: DefendantPlea,
) => {
  switch (defendantPlea) {
    case DefendantPlea.GUILTY:
      return `${defendantName} - Játar sök`
    case DefendantPlea.NOT_GUILTY:
      return `${defendantName} - Neitar sök`
    case DefendantPlea.NO_PLEA:
      return `${defendantName} - Tjáir sig ekki / óljóst`
    default:
      return ''
  }
}

export const shouldUseAppealWithdrawnRoutes = (theCase: Case): boolean => {
  return (
    theCase.appealState === CaseAppealState.WITHDRAWN &&
    (!theCase.appealAssistant ||
      !theCase.appealCaseNumber ||
      !theCase.appealJudge1 ||
      !theCase.appealJudge2 ||
      !theCase.appealJudge3)
  )
}

export const shouldDisplayGeneratedPdfFiles = (theCase: Case, user?: User) =>
  Boolean(
    isProsecutionUser(user) ||
      theCase.defendants?.some(
        (defendant) =>
          defendant.isDefenderChoiceConfirmed &&
          defendant.caseFilesSharedWithDefender &&
          defendant.defenderNationalId &&
          normalizeAndFormatNationalId(user?.nationalId).includes(
            defendant.defenderNationalId,
          ),
      ) ||
      theCase.civilClaimants?.some(
        (civilClaimant) =>
          civilClaimant.hasSpokesperson &&
          civilClaimant.isSpokespersonConfirmed &&
          civilClaimant.caseFilesSharedWithSpokesperson &&
          civilClaimant.spokespersonNationalId &&
          normalizeAndFormatNationalId(user?.nationalId).includes(
            civilClaimant.spokespersonNationalId,
          ),
      ),
  )

export const isCaseDefendantDefender = (
  user?: User,
  workingCase?: { defendants?: Defendant[] | null },
) =>
  workingCase?.defendants?.some(
    (defendant) =>
      defendant?.defenderNationalId &&
      normalizeAndFormatNationalId(user?.nationalId).includes(
        defendant.defenderNationalId,
      ),
  )

export const isCaseCivilClaimantSpokesperson = (
  user?: User,
  workingCase?: { civilClaimants?: CivilClaimant[] | null },
) =>
  workingCase?.civilClaimants?.some(
    (civilClaimant) =>
      civilClaimant?.spokespersonNationalId &&
      normalizeAndFormatNationalId(user?.nationalId).includes(
        civilClaimant.spokespersonNationalId,
      ),
  )

export const isCaseCivilClaimantLegalSpokesperson = (
  user?: User,
  workingCase?: { civilClaimants?: CivilClaimant[] | null },
) =>
  workingCase?.civilClaimants?.some(
    (civilClaimant) =>
      civilClaimant?.spokespersonNationalId &&
      normalizeAndFormatNationalId(user?.nationalId).includes(
        civilClaimant.spokespersonNationalId,
      ) &&
      civilClaimant.spokespersonIsLawyer,
  )

// Use the gender of the single defendant if there is only one,
// otherwise default to male
export const getDefaultDefendantGender = (defendants?: Defendant[] | null) =>
  defendants && defendants.length === 1
    ? defendants[0].gender ?? Gender.MALE
    : Gender.MALE

export const isPartiallyVisible = (el: HTMLElement): boolean => {
  const rect = el.getBoundingClientRect()
  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= window.innerHeight &&
    rect.left <= window.innerWidth
  )
}
