import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  EventType,
  getIndictmentVerdictAppealDeadlineStatus,
  IndictmentCaseReviewDecision,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isIndictmentCase,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isProsecutionUser,
  isPublicProsecutorUser,
  isRequestCase,
  isRestrictionCase,
  RequestSharedWithDefender,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { DateLog } from '../models/dateLog.model'

const canProsecutionUserAccessCase = (
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean => {
  // Check case type access
  if (user.role !== UserRole.PROSECUTOR && !isIndictmentCase(theCase.type)) {
    return false
  }

  // Check case state access
  if (
    ![
      CaseState.NEW,
      CaseState.DRAFT,
      CaseState.WAITING_FOR_CONFIRMATION,
      CaseState.SUBMITTED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
      CaseState.COMPLETED,
    ].includes(theCase.state)
  ) {
    return false
  }

  // Check prosecutors office access
  if (
    user.institution?.id !== theCase.prosecutorsOfficeId &&
    (forUpdate ||
      user.institution?.id !== theCase.sharedWithProsecutorsOfficeId) &&
    user.id !== theCase.indictmentReviewerId
  ) {
    return false
  }

  // Check heightened security level access
  if (
    theCase.isHeightenedSecurityLevel &&
    user.id !== theCase.creatingProsecutorId &&
    user.id !== theCase.prosecutorId
  ) {
    return false
  }

  return true
}

const canPublicProsecutionUserAccessCase = (theCase: Case): boolean => {
  // Check case type access
  if (!isIndictmentCase(theCase.type)) {
    return false
  }

  // Check case state access
  if (theCase.state !== CaseState.COMPLETED) {
    return false
  }

  // Check indictment ruling decision access
  if (
    !theCase.indictmentRulingDecision ||
    ![
      CaseIndictmentRulingDecision.FINE,
      CaseIndictmentRulingDecision.RULING,
    ].includes(theCase.indictmentRulingDecision)
  ) {
    return false
  }

  // Make sure the indictment has been sent to the public prosecutor
  if (
    !theCase.eventLogs?.some(
      (eventLog) =>
        eventLog.eventType === EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    )
  ) {
    return false
  }

  return true
}

const canDistrictCourtUserAccessCase = (theCase: Case, user: User): boolean => {
  // Check case type access
  if (
    ![
      UserRole.DISTRICT_COURT_JUDGE,
      UserRole.DISTRICT_COURT_REGISTRAR,
    ].includes(user.role)
  ) {
    if (!isIndictmentCase(theCase.type)) {
      return false
    }
  }

  // Check case state access
  if (isRequestCase(theCase.type)) {
    if (
      ![
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ].includes(theCase.state)
    ) {
      return false
    }
  } else if (
    ![
      CaseState.SUBMITTED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      CaseState.COMPLETED,
    ].includes(theCase.state)
  ) {
    return false
  }

  // Check court access
  if (user.institution?.id !== theCase.courtId) {
    return false
  }

  return true
}

const canAppealsCourtUserAccessCase = (theCase: Case): boolean => {
  // Check case type access
  if (!isRequestCase(theCase.type)) {
    return false
  }

  // Check case state access
  if (
    ![CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED].includes(
      theCase.state,
    )
  ) {
    return false
  }

  // Check appeal state access
  if (
    !theCase.appealState ||
    ![
      CaseAppealState.RECEIVED,
      CaseAppealState.COMPLETED,
      CaseAppealState.WITHDRAWN,
    ].includes(theCase.appealState)
  ) {
    return false
  }

  if (
    theCase.appealState === CaseAppealState.WITHDRAWN &&
    !theCase.appealReceivedByCourtDate
  ) {
    return false
  }

  return true
}

const canPrisonStaffUserAccessCase = (
  theCase: Case,
  forUpdate = true,
): boolean => {
  // Prison staff users cannot update cases
  if (forUpdate) {
    return false
  }

  // Check case type access
  if (
    ![
      CaseType.CUSTODY,
      CaseType.ADMISSION_TO_FACILITY,
      CaseType.PAROLE_REVOCATION,
    ].includes(theCase.type)
  ) {
    return false
  }

  // Check case state access
  if (theCase.state !== CaseState.ACCEPTED) {
    return false
  }

  // Check decision access
  if (
    !theCase.decision ||
    ![CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY].includes(
      theCase.decision,
    )
  ) {
    return false
  }

  return true
}

const canPrisonAdminUserAccessCase = (
  theCase: Case,
  forUpdate = true,
): boolean => {
  // Prison admin users cannot update cases
  if (forUpdate) {
    return false
  }

  // Check case type access
  if (
    !isRestrictionCase(theCase.type) &&
    theCase.type !== CaseType.PAROLE_REVOCATION &&
    !isIndictmentCase(theCase.type)
  ) {
    return false
  }

  if (isRequestCase(theCase.type)) {
    // Check case state access
    if (theCase.state !== CaseState.ACCEPTED) {
      return false
    }

    // Check decision access
    if (
      !theCase.decision ||
      ![
        CaseDecision.ACCEPTING,
        CaseDecision.ACCEPTING_PARTIALLY,
        CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
      ].includes(theCase.decision)
    ) {
      return false
    }
  }

  if (isIndictmentCase(theCase.type)) {
    // Check case state access
    if (theCase.state !== CaseState.COMPLETED) {
      return false
    }

    // Check case indictment ruling decision access
    if (
      theCase.indictmentRulingDecision !== CaseIndictmentRulingDecision.RULING
    ) {
      return false
    }

    // Check indictment case review decision access
    if (
      theCase.indictmentReviewDecision !== IndictmentCaseReviewDecision.ACCEPT
    ) {
      return false
    }
  }

  // Check defendant verdict appeal deadline access
  const verdictInfo = theCase.defendants?.map<[boolean, Date | undefined]>(
    (defendant) => [true, defendant.verdictViewDate],
  )

  const [_, indictmentVerdictAppealDeadlineExpired] =
    getIndictmentVerdictAppealDeadlineStatus(verdictInfo)

  if (!indictmentVerdictAppealDeadlineExpired) {
    return false
  }

  return true
}

const canDefenceUserAccessCase = (theCase: Case, user: User): boolean => {
  // Check case state access
  if (
    ![
      CaseState.SUBMITTED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
      CaseState.COMPLETED,
    ].includes(theCase.state)
  ) {
    return false
  }

  const arraignmentDate = DateLog.arraignmentDate(theCase.dateLogs)

  // Check submitted case access
  const canDefenderAccessSubmittedCase =
    isRequestCase(theCase.type) &&
    theCase.requestSharedWithDefender ===
      RequestSharedWithDefender.READY_FOR_COURT

  if (
    theCase.state === CaseState.SUBMITTED &&
    !canDefenderAccessSubmittedCase
  ) {
    return false
  }

  // Check received case access
  if (theCase.state === CaseState.RECEIVED) {
    const canDefenderAccessReceivedCase =
      isIndictmentCase(theCase.type) ||
      canDefenderAccessSubmittedCase ||
      Boolean(arraignmentDate)

    if (!canDefenderAccessReceivedCase) {
      return false
    }
  }

  const normalizedAndFormattedNationalId = normalizeAndFormatNationalId(
    user.nationalId,
  )

  // Check case defender access
  if (isIndictmentCase(theCase.type)) {
    if (
      !theCase.defendants?.some(
        (defendant) =>
          defendant.defenderNationalId &&
          normalizedAndFormattedNationalId.includes(
            defendant.defenderNationalId,
          ),
      )
    ) {
      return false
    }
  } else {
    if (
      !theCase.defenderNationalId ||
      !normalizedAndFormattedNationalId.includes(theCase.defenderNationalId)
    ) {
      return false
    }
  }

  return true
}

export const canUserAccessCase = (
  theCase: Case,
  user: User,
  forUpdate = true,
): boolean => {
  if (isProsecutionUser(user)) {
    return canProsecutionUserAccessCase(theCase, user, forUpdate)
  }

  if (isDistrictCourtUser(user)) {
    return canDistrictCourtUserAccessCase(theCase, user)
  }

  if (isCourtOfAppealsUser(user)) {
    return canAppealsCourtUserAccessCase(theCase)
  }

  if (isPrisonStaffUser(user)) {
    return canPrisonStaffUserAccessCase(theCase, forUpdate)
  }

  if (isPrisonAdminUser(user)) {
    return canPrisonAdminUserAccessCase(theCase, forUpdate)
  }

  if (isDefenceUser(user)) {
    return canDefenceUserAccessCase(theCase, user)
  }

  if (isPublicProsecutorUser(user)) {
    return canPublicProsecutionUserAccessCase(theCase)
  }

  // Other users cannot access cases
  return false
}
