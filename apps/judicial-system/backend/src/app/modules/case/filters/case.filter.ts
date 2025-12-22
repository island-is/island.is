import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  EventType,
  IndictmentCaseReviewDecision,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isIndictmentCase,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  isRequestCase,
  isRestrictionCase,
  RequestSharedWhen,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  Case,
  CivilClaimant,
  DateLog,
  Defendant,
  EventLog,
  Victim,
} from '../../repository'
import { MinimalCase } from '../models/case.types'

const canProsecutionUserAccessCase = (
  theCase: Case,
  user: User,
  forUpdate: boolean,
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
      CaseState.CORRECTING,
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

export const canPublicProsecutionUserAccessCase = (theCase: Case): boolean => {
  // Check case type access
  if (!isIndictmentCase(theCase.type)) {
    return false
  }

  // Check case state access
  if (
    theCase.state !== CaseState.COMPLETED &&
    theCase.state !== CaseState.CORRECTING
  ) {
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
  return Boolean(
    EventLog.getEventLogByEventType(
      EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      theCase.eventLogs,
    ),
  )
}

const canDistrictCourtUserAccessCase = (theCase: Case, user: User): boolean => {
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
      CaseState.CORRECTING,
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
  forUpdate: boolean,
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
  forUpdate: boolean,
): boolean => {
  // Prison admin users cannot update cases
  if (forUpdate) {
    if (!isIndictmentCase(theCase.type) && theCase.type !== CaseType.CUSTODY) {
      return false
    }
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
    if (
      theCase.state !== CaseState.COMPLETED &&
      theCase.state !== CaseState.CORRECTING
    ) {
      return false
    }

    // Check case indictment ruling decision access
    if (
      theCase.indictmentRulingDecision !==
        CaseIndictmentRulingDecision.RULING &&
      theCase.indictmentRulingDecision !== CaseIndictmentRulingDecision.FINE
    ) {
      return false
    }

    // Check indictment case review decision access
    if (
      theCase.indictmentReviewDecision !== IndictmentCaseReviewDecision.ACCEPT
    ) {
      return false
    }

    // Check if a defendant has been sent to the prison admin
    if (
      !theCase.defendants?.some((defendant) => defendant.isSentToPrisonAdmin)
    ) {
      return false
    }
  }

  return true
}

const canDefenceUserAccessRequestCaseState = ({
  requestSharedWhen,
  state,
  dateLogs,
}: {
  requestSharedWhen?: string
  state: CaseState
  dateLogs?: DateLog[]
}) => {
  // Check submitted case access
  const canDefenderAccessSubmittedCase =
    requestSharedWhen === RequestSharedWhen.READY_FOR_COURT

  if (state === CaseState.SUBMITTED && !canDefenderAccessSubmittedCase) {
    return false
  }

  // Check received case access
  const canDefenderAccessReceivedCase =
    canDefenderAccessSubmittedCase || Boolean(DateLog.arraignmentDate(dateLogs))

  if (state === CaseState.RECEIVED && !canDefenderAccessReceivedCase) {
    return false
  }

  return true
}

const canCaseDefendantDefenceUserAccessRequestCase = (
  theCase: Case,
  user: User,
) => {
  if (
    !canDefenceUserAccessRequestCaseState({
      requestSharedWhen: theCase.requestSharedWithDefender,
      state: theCase.state,
      dateLogs: theCase.dateLogs,
    })
  ) {
    return false
  }

  const normalizedAndFormattedNationalId = normalizeAndFormatNationalId(
    user.nationalId,
  )

  // Check case defender assignment
  return (
    theCase.defenderNationalId &&
    normalizedAndFormattedNationalId.includes(theCase.defenderNationalId)
  )
}

const canDefenceUserAccessRequestCase = (
  theCase: Case,
  user: User,
): boolean => {
  // Check case state access
  if (
    ![
      CaseState.SUBMITTED,
      CaseState.RECEIVED,
      CaseState.ACCEPTED,
      CaseState.REJECTED,
      CaseState.DISMISSED,
    ].includes(theCase.state)
  ) {
    return false
  }

  // CASE DEFENDANT
  if (canCaseDefendantDefenceUserAccessRequestCase(theCase, user)) {
    return true
  }

  // VICTIM LAWYER
  const victimWithLawyer = Victim.getVictimWithLawyer(
    user.nationalId,
    theCase.victims,
  )

  return Boolean(
    victimWithLawyer &&
      canDefenceUserAccessRequestCaseState({
        requestSharedWhen: victimWithLawyer.lawyerAccessToRequest,
        state: theCase.state,
        dateLogs: theCase.dateLogs,
      }),
  )
}

const canDefenceUserAccessIndictmentCase = (
  theCase: Case,
  user: User,
): boolean => {
  // Check case state access
  if (
    ![
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      CaseState.COMPLETED,
      CaseState.CORRECTING,
    ].includes(theCase.state)
  ) {
    return false
  }

  // Check received case access
  const canDefenderAccessReceivedCase = Boolean(
    DateLog.arraignmentDate(theCase.dateLogs),
  )

  if (theCase.state === CaseState.RECEIVED && !canDefenderAccessReceivedCase) {
    return false
  }

  // Check case defender assignment
  if (
    Defendant.isConfirmedDefenderOfDefendant(
      user.nationalId,
      theCase.defendants,
    )
  ) {
    return true
  }

  // Check case spokesperson assignment
  if (
    CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(
      user.nationalId,
      theCase.civilClaimants,
    )
  ) {
    return true
  }

  return false
}

const canDefenceUserAccessCase = (theCase: Case, user: User): boolean => {
  if (isRequestCase(theCase.type)) {
    return canDefenceUserAccessRequestCase(theCase, user)
  }

  if (isIndictmentCase(theCase.type)) {
    return canDefenceUserAccessIndictmentCase(theCase, user)
  }

  // Other cases are not accessible to defence users
  return false
}

export const canUserAccessCase = (
  theCase: Case,
  user: User,
  forUpdate: boolean,
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

  if (isPublicProsecutionOfficeUser(user)) {
    return canPublicProsecutionUserAccessCase(theCase)
  }

  // Other users cannot access cases
  return false
}

export const canUserAccessMinimalCase = (
  theCase: MinimalCase,
  user: User,
): boolean => {
  if (isProsecutionUser(user)) {
    return canProsecutionUserAccessCase(theCase, user, false)
  }

  if (isDistrictCourtUser(user)) {
    return canDistrictCourtUserAccessCase(theCase, user)
  }

  // Other users can be added when needed
  return false
}
