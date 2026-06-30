import { TagVariant } from '@island.is/island-ui/core'
import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  isCourtOfAppealsUser,
  isDefenceUser,
  isIndictmentCase,
  isProsecutionUser,
  isRequestCase,
} from '@island.is/judicial-system/types'
import {
  AppealCase,
  AppealCaseState,
  Case,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseFileCategory,
  Defendant,
  DefendantPlea,
  Gender,
  Notification,
  TrackedNotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

export const mapStringToGender = (
  gender?: string | null,
): Gender | undefined => {
  const normalizedGender = gender?.trim().toLowerCase()

  switch (normalizedGender) {
    case 'male':
    case 'karl':
      return Gender.MALE
    case 'female':
    case 'kona':
      return Gender.FEMALE
    case 'other':
    case 'kynsegin/annað':
    case 'kynsegin':
    case 'annað':
      return Gender.OTHER
    default:
      return undefined
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
  notificationType: TrackedNotificationType,
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
  appealCase: AppealCase | undefined | null,
): boolean => {
  return (
    appealCase?.appealState !== AppealCaseState.COMPLETED &&
    Boolean(appealCase?.appealRulingDate)
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

export const shouldUseAppealWithdrawnRoutes = (
  appealCase: AppealCase | undefined | null,
): boolean => {
  return (
    appealCase?.appealState === AppealCaseState.WITHDRAWN &&
    (!appealCase.appealAssistant ||
      !appealCase.appealCaseNumber ||
      !appealCase.appealJudge1 ||
      !appealCase.appealJudge2 ||
      !appealCase.appealJudge3)
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

export const isCaseDefendantDefender = (user?: User, workingCase?: Case) =>
  workingCase?.defendants?.some(
    (defendant) =>
      defendant?.defenderNationalId &&
      normalizeAndFormatNationalId(user?.nationalId).includes(
        defendant.defenderNationalId,
      ),
  )

export const isCaseCivilClaimantSpokesperson = (
  user?: User,
  workingCase?: Case,
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
  workingCase?: Case,
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
 * Only confirmed defenders / spokespersons are resolved — an unconfirmed
 * pick has no authority to act on behalf of the party.
 *
 * Resolution order:
 * 1. First matching confirmed defendant (by defenderNationalId)
 * 2. First matching confirmed civil claimant (by spokespersonNationalId)
 * 3. Empty object (prosecutor or no match)
 */
export const getDefenceUserPartyIds = (
  workingCase: Case,
  user: User | undefined,
): { defendantId?: string; civilClaimantId?: string } => {
  if (!user || !isIndictmentCase(workingCase.type)) {
    return {}
  }

  const normalizedId = normalizeAndFormatNationalId(user.nationalId)

  const defendant = workingCase.defendants?.find(
    (d) =>
      d.isDefenderChoiceConfirmed &&
      d.defenderNationalId &&
      normalizedId.includes(d.defenderNationalId),
  )

  if (defendant) {
    return { defendantId: defendant.id }
  }

  const civilClaimant = workingCase.civilClaimants?.find(
    (cc) =>
      cc.isSpokespersonConfirmed &&
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
 * Branches by case type, then by appeal kind for indictment cases. The
 * prosecutor term differs by case type: request (R) cases say "sækjandi",
 * indictment (S) cases say "ákærandi".
 * - Request cases (case-level appeals only): in-court branch + "Kært af X"
 *   passive form.
 * - Indictment ruling-order appeals: subject-verb form ("Ákærandi kærði
 *   úrskurðinn …").
 * - Indictment case-level appeals (dismissal): same passive form as request
 *   cases out-of-court — no in-court mechanic.
 *
 * `appealCase` defaults to `workingCase.appealCase` so case-level call sites
 * can omit it; ruling-order call sites pass the specific appeal-case row.
 */
export const getAppealActorText = (
  workingCase: Case,
  appealCase: AppealCase | null | undefined = workingCase.appealCase,
): string => {
  if (isRequestCase(workingCase.type)) {
    const appealedInCourt =
      workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL ||
      workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL

    if (appealedInCourt) {
      return appealCase?.appealedByRole === UserRole.PROSECUTOR
        ? 'Sækjandi kærði í þinghaldi'
        : 'Varnaraðili kærði í þinghaldi'
    }

    const dateStr = formatDate(appealCase?.appealedDate, 'PPPp')

    if (appealCase?.appealedByRole === UserRole.PROSECUTOR) {
      return `Kært af sækjanda ${dateStr}`
    }

    const party = getAppealingPartyInfo(
      workingCase,
      appealCase?.appealedByNationalId,
    )

    return party
      ? `${party.role} ${party.name} kærði úrskurðinn ${dateStr}`
      : `Kært af verjanda ${dateStr}`
  }

  // Indictment case
  if (appealCase?.rulingFileId) {
    const dateStr = formatDate(appealCase.appealedDate, 'PPPp')

    // In-court ruling-order appeal: any number of parties may have appealed in
    // the þingbók, so the court of appeals shows it without naming who appealed.
    if (appealCase.appealedInCourt) {
      return `Kært í þinghaldi ${dateStr}`
    }

    if (appealCase.appealedByRole === UserRole.PROSECUTOR) {
      return `Ákærandi kærði úrskurðinn ${dateStr}`
    }

    const party = getAppealingPartyInfo(
      workingCase,
      appealCase.appealedByNationalId,
    )

    return party
      ? `${party.role} ${party.name} kærði úrskurðinn ${dateStr}`
      : `Verjandi kærði úrskurðinn ${dateStr}`
  }

  // Indictment case-level (dismissal) appeal
  const dateStr = formatDate(appealCase?.appealedDate, 'PPPp')

  if (appealCase?.appealedByRole === UserRole.PROSECUTOR) {
    return `Kært af ákæranda ${dateStr}`
  }

  const party = getAppealingPartyInfo(
    workingCase,
    appealCase?.appealedByNationalId,
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
  workingCase: Case,
  appealedByNationalId?: string | null,
): { role: string; name: string } | undefined => {
  if (!appealedByNationalId) {
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

/**
 * Mirrors the backend's ruling-link reconciliation on the working case so the
 * in-court appeal decision cards stay in sync when a court session's ruling
 * order file changes:
 * - swap (old -> new file): re-key the ruling's decisions onto the new file;
 * - removal (old -> none, ruling type left ORDER): drop the ruling's decisions.
 * Decisions are matched on `rulingFileId`, so without this the cards would look
 * empty after a change even though the rows still exist (under the new file) or
 * were deleted on the server.
 */
export const reconcileAppealDecisionsForRulingFileChange = (
  appealDecisions: Case['appealDecisions'],
  previousRulingFileId: string | null | undefined,
  nextRulingFileId: string | null | undefined,
): Case['appealDecisions'] => {
  if (!previousRulingFileId || previousRulingFileId === nextRulingFileId) {
    return appealDecisions
  }

  if (nextRulingFileId) {
    return appealDecisions?.map((decision) =>
      decision.rulingFileId === previousRulingFileId
        ? { ...decision, rulingFileId: nextRulingFileId }
        : decision,
    )
  }

  return appealDecisions?.filter(
    (decision) => decision.rulingFileId !== previousRulingFileId,
  )
}

/**
 * Returns true iff the file's category is visible per the appeal-state rules,
 * given the specific appeal-case row in scope. Encodes:
 * - Brief categories: visible iff the appellant's role matches.
 * - Statement categories: visible iff the submitter has actually submitted on
 *   this appeal — singular date gate for request cases, per-party (defendantId
 *   / civilClaimantId match against the lists) for indictment cases.
 * - Free-form *_APPEAL_CASE_FILE: always visible while the appeal exists.
 * - APPEAL_RULING / APPEAL_COURT_RECORD: visible to Court of Appeals always,
 *   to all parties once the appeal is COMPLETED.
 *
 * Returns false when the file lacks a category, when the appeal-case row is
 * absent, or when the category is not appeal-related.
 */
export const isAppealFileCategoryVisible = (
  workingCase: Case,
  appealCase: AppealCase | null | undefined,
  file: {
    category?: CaseFileCategory | null
    defendantId?: string | null
    civilClaimantId?: string | null
    rulingFileId?: string | null
  },
  user: User | undefined,
): boolean => {
  if (!file.category || !appealCase) {
    return false
  }

  // Each AppealCase row owns its own files. Case-level appeals (rulingFileId
  // null) only see case-level files; ruling-order appeals only see files
  // tagged with their specific rulingFileId.
  if ((appealCase.rulingFileId ?? null) !== (file.rulingFileId ?? null)) {
    return false
  }

  switch (file.category) {
    case CaseFileCategory.PROSECUTOR_APPEAL_BRIEF:
    case CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE:
      return appealCase.appealedByRole === UserRole.PROSECUTOR

    case CaseFileCategory.DEFENDANT_APPEAL_BRIEF:
    case CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE: {
      if (appealCase.appealedByRole !== UserRole.DEFENDER) {
        return false
      }
      if (isRequestCase(workingCase.type)) {
        return true
      }
      // Indictment: the appellant's national id must match the confirmed
      // defender of the file's defendant, or the confirmed spokesperson of
      // the file's civil claimant.
      if (!appealCase.appealedByNationalId) {
        return false
      }
      const normalizedAppellantId = normalizeAndFormatNationalId(
        appealCase.appealedByNationalId,
      )
      if (file.defendantId) {
        const defendant = workingCase.defendants?.find(
          (d) => d.id === file.defendantId,
        )
        return Boolean(
          defendant?.isDefenderChoiceConfirmed &&
            defendant.defenderNationalId &&
            normalizedAppellantId.includes(defendant.defenderNationalId),
        )
      }
      if (file.civilClaimantId) {
        const civilClaimant = workingCase.civilClaimants?.find(
          (cc) => cc.id === file.civilClaimantId,
        )
        return Boolean(
          civilClaimant?.hasSpokesperson &&
            civilClaimant.isSpokespersonConfirmed &&
            civilClaimant.spokespersonNationalId &&
            normalizedAppellantId.includes(
              civilClaimant.spokespersonNationalId,
            ),
        )
      }
      return false
    }

    case CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT:
    case CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE:
      return Boolean(appealCase.prosecutorStatementDate)

    case CaseFileCategory.DEFENDANT_APPEAL_STATEMENT:
    case CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE:
      if (isRequestCase(workingCase.type)) {
        return Boolean(appealCase.defendantStatementDate)
      }
      if (file.defendantId) {
        return Boolean(
          appealCase.defendantStatementDates?.some(
            (d) => d.defendantId === file.defendantId,
          ),
        )
      }
      if (file.civilClaimantId) {
        return Boolean(
          appealCase.civilClaimantStatementDates?.some(
            (cc) => cc.civilClaimantId === file.civilClaimantId,
          ),
        )
      }
      return false

    case CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE:
      // Hidden from defenders in request cases (prosecution-only material).
      if (isRequestCase(workingCase.type) && isDefenceUser(user)) {
        return false
      }
      return true

    case CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE:
      return true

    case CaseFileCategory.APPEAL_RULING:
    case CaseFileCategory.APPEAL_COURT_RECORD:
      return (
        appealCase.appealState === AppealCaseState.COMPLETED ||
        isCourtOfAppealsUser(user)
      )

    default:
      return false
  }
}

export const isMatchingAppealCaseFile = (
  workingCase: Case,
  categories: CaseFileCategory[],
  file: {
    category?: CaseFileCategory | null
    defendantId?: string | null
    civilClaimantId?: string | null
    rulingFileId?: string | null
  },
  user: User | undefined,
  rulingFileId?: string | null,
): boolean => {
  if (!file.category) {
    return false
  }

  if (!categories.includes(file.category)) {
    return false
  }

  if ((file.rulingFileId ?? null) !== (rulingFileId ?? null)) {
    return false
  }

  if (isProsecutionUser(user)) {
    return true
  }

  if (!isDefenceUser(user)) {
    return false
  }

  if (isRequestCase(workingCase.type)) {
    return true
  }

  if (!isIndictmentCase(workingCase.type)) {
    return false
  }

  if (!user?.nationalId) {
    return false
  }

  if (file.defendantId && workingCase.defendants) {
    return workingCase.defendants.some(
      (defendant) =>
        defendant.id === file.defendantId &&
        defendant.isDefenderChoiceConfirmed &&
        defendant.defenderNationalId &&
        normalizeAndFormatNationalId(user.nationalId).includes(
          defendant.defenderNationalId,
        ),
    )
  }

  if (file.civilClaimantId && workingCase.civilClaimants) {
    return workingCase.civilClaimants.some(
      (cc) =>
        cc.id === file.civilClaimantId &&
        cc.hasSpokesperson &&
        cc.isSpokespersonConfirmed &&
        cc.spokespersonNationalId &&
        normalizeAndFormatNationalId(user.nationalId).includes(
          cc.spokespersonNationalId,
        ),
    )
  }

  return false
}

// For indictment cases each defender / civil claimant spokesperson sends
// their own statement, so resolve the per-party date from the per-appeal
// lists by id. Request cases have a single defender, so the aggregated
// appealCase.defendantStatementDate is the right answer.
export const getCurrentUserStatementDate = (
  workingCase: Case,
  appealCase: AppealCase | null | undefined,
  user: User | undefined,
): string | undefined => {
  if (!appealCase) {
    return undefined
  }

  const isProsecution = isProsecutionUser(user)
  const isDefence = isDefenceUser(user)

  if (!isProsecution && !isDefence) {
    return undefined
  }

  if (isRequestCase(workingCase.type)) {
    return isProsecution
      ? appealCase.prosecutorStatementDate ?? undefined
      : appealCase.defendantStatementDate ?? undefined
  }

  if (!isIndictmentCase(workingCase.type)) {
    return undefined
  }

  if (isProsecution) {
    return appealCase.prosecutorStatementDate ?? undefined
  }

  const { defendantId, civilClaimantId } = getDefenceUserPartyIds(
    workingCase,
    user,
  )

  if (defendantId) {
    return appealCase?.defendantStatementDates?.find(
      (d) => d.defendantId === defendantId,
    )?.statementDate
  }

  if (civilClaimantId) {
    return appealCase?.civilClaimantStatementDates?.find(
      (c) => c.civilClaimantId === civilClaimantId,
    )?.statementDate
  }

  return undefined
}

// Appends `?appealCaseId=…` to a path when the param is set. COA detail-page
// navigation handlers use this to forward the query param to the next screen
// so ruling-order rows keep resolving to the right appeal across navigations.
export const appendAppealCaseIdQuery = (
  path: string,
  appealCaseId: string | undefined,
): string => (appealCaseId ? `${path}?appealCaseId=${appealCaseId}` : path)

// Returns a new Case with `update` merged into the appeal-case slot that
// matches `targetAppealCaseId`. For optimistic `setWorkingCase` updates from
// COA detail pages — ruling-order rows need their updates routed into
// `rulingOrderAppealCases[i]` rather than the case-level `appealCase`.
export const applyAppealCaseUpdate = (
  workingCase: Case,
  targetAppealCaseId: string,
  update: Partial<AppealCase>,
): Case => {
  if (workingCase.appealCase?.id === targetAppealCaseId) {
    return {
      ...workingCase,
      appealCase: { ...workingCase.appealCase, ...update },
    }
  }

  return {
    ...workingCase,
    rulingOrderAppealCases: workingCase.rulingOrderAppealCases?.map((a) =>
      a.id === targetAppealCaseId ? { ...a, ...update } : a,
    ),
  }
}

export const areAllDefenderDefendantsCancelledOrDismissed = (
  nationalId: string | null | undefined,
  defendants: Defendant[] | null | undefined,
): boolean => {
  if (!nationalId || !defendants) {
    return false
  }
  const normalizedId = normalizeAndFormatNationalId(nationalId)
  const defenderDefendants = defendants.filter(
    (d) =>
      d.isDefenderChoiceConfirmed &&
      d.defenderNationalId &&
      normalizedId.includes(d.defenderNationalId),
  )
  return (
    defenderDefendants.length > 0 &&
    defenderDefendants.every((d) => d.indictmentCancelledOrDismissedState)
  )
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
