import { TagVariant } from '@island.is/island-ui/core'
import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  Case,
  CaseAppealDecision,
  CaseAppealState,
  CaseCustodyRestrictions,
  CivilClaimant,
  Defendant,
  DefendantPlea,
  Gender,
  Notification,
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

export const mapStringToGender = (gender?: string | null): Gender | undefined =>
  gender?.toLowerCase() === 'male'
    ? Gender.MALE
    : gender?.toLowerCase() === 'female'
    ? Gender.FEMALE
    : gender?.toLowerCase() === 'other'
    ? Gender.OTHER
    : undefined

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
    theCase.appealCase?.appealState === CaseAppealState.WITHDRAWN &&
    (!theCase.appealCase?.appealAssistant ||
      !theCase.appealCase?.appealCaseNumber ||
      !theCase.appealCase?.appealJudge1 ||
      !theCase.appealCase?.appealJudge2 ||
      !theCase.appealCase?.appealJudge3)
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

/**
 * For indictment cases, returns the defendant ID or civil claimant ID
 * that the current defence user represents. Used to associate uploaded
 * appeal files with the correct party.
 *
 * Resolution order:
 * 1. First matching defendant (by defenderNationalId)
 * 2. First matching civil claimant (by spokespersonNationalId)
 * 3. Empty object (prosecutor or no match)
 */
export const getDefenceUserPartyIds = (
  user?: User,
  workingCase?: {
    type?: string | null
    defendants?: Defendant[] | null
    civilClaimants?: CivilClaimant[] | null
  },
): { defendantId?: string; civilClaimantId?: string } => {
  if (!user || !workingCase || !isIndictmentCase(workingCase.type)) {
    return {}
  }

  const normalizedId = normalizeAndFormatNationalId(user.nationalId)

  const defendant = workingCase.defendants?.find(
    (d) => d.defenderNationalId && normalizedId.includes(d.defenderNationalId),
  )

  if (defendant) {
    return { defendantId: defendant.id }
  }

  const civilClaimant = workingCase.civilClaimants?.find(
    (cc) =>
      cc.spokespersonNationalId &&
      normalizedId.includes(cc.spokespersonNationalId),
  )

  if (civilClaimant) {
    return { civilClaimantId: civilClaimant.id }
  }

  return {}
}

/**
 * Returns a human-readable description of who appealed and when.
 *
 * Examples:
 * - "Sækjandi kærði í þinghaldi"
 * - "Kært af sækjanda 1. apríl 2026 kl. 10:00"
 * - "Verjandi Jón Jónsson kærði úrskurðinn 1. apríl 2026 kl. 10:00"
 * - "Lögmaður Anna Önnudóttir kærði úrskurðinn 1. apríl 2026 kl. 10:00"
 */
export const getAppealActorText = (workingCase: {
  prosecutorAppealDecision?: CaseAppealDecision | null
  accusedAppealDecision?: CaseAppealDecision | null
  appealedByRole?: UserRole | null
  appealedDate?: string | null
  appealCase?: { appealedByNationalId?: string | null } | null
  defendants?: Defendant[] | null
  civilClaimants?: CivilClaimant[] | null
}): string => {
  const appealedInCourt =
    workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL ||
    workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL

  if (appealedInCourt) {
    return workingCase.appealedByRole === UserRole.PROSECUTOR
      ? 'Sækjandi kærði í þinghaldi'
      : 'Varnaraðili kærði í þinghaldi'
  }

  const dateStr = formatDate(workingCase.appealedDate, 'PPPp')

  if (workingCase.appealedByRole === UserRole.PROSECUTOR) {
    return `Kært af sækjanda ${dateStr}`
  }

  const party = getAppealingPartyInfo(
    workingCase.appealCase?.appealedByNationalId,
    workingCase,
  )

  return party
    ? `${party.role} ${party.name} kærði úrskurðinn ${dateStr}`
    : `Kært af verjanda ${dateStr}`
}

/**
 * Given an appealedByNationalId, find the appealing party among confirmed
 * defenders and civil claimant spokespersons.
 *
 * Search order: confirmed defenders first, then confirmed civil claimant
 * spokespersons.
 *
 * Returns the role label and name, or undefined if not found.
 */
export const getAppealingPartyInfo = (
  appealedByNationalId?: string | null,
  workingCase?: {
    defendants?: Defendant[] | null
    civilClaimants?: CivilClaimant[] | null
  },
): { role: string; name: string } | undefined => {
  if (!appealedByNationalId || !workingCase) {
    return undefined
  }

  const normalizedId = normalizeAndFormatNationalId(appealedByNationalId)

  // Check confirmed defenders first
  const defender = workingCase.defendants?.find(
    (defendant) =>
      defendant.isDefenderChoiceConfirmed &&
      defendant.defenderNationalId &&
      normalizedId.includes(defendant.defenderNationalId),
  )

  if (defender) {
    return { role: 'Verjandi', name: defender.defenderName ?? '' }
  }

  // Then check confirmed civil claimant spokespersons
  const civilClaimant = workingCase.civilClaimants?.find(
    (cc) =>
      cc.hasSpokesperson &&
      cc.isSpokespersonConfirmed &&
      cc.spokespersonNationalId &&
      normalizedId.includes(cc.spokespersonNationalId),
  )

  if (civilClaimant) {
    return {
      role: civilClaimant.spokespersonIsLawyer
        ? 'Lögmaður'
        : 'Réttargæslumaður',
      name: civilClaimant.spokespersonName ?? '',
    }
  }

  return undefined
}

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
