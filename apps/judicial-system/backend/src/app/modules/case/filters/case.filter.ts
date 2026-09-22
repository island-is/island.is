import {
  AppealCaseState,
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
  isPublicProsecutionUser,
  isRequestCase,
  isRestrictionCase,
  RequestSharedWhen,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  AppealCase,
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
      CaseState.WAITING_FOR_REVIEW,
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

// A verdict on this case has been appealed - the same rule the appealed case
// list is built from, in TypeScript. Keep it in step with
// buildHasAppealedVerdictCondition in the case table's where options: a list
// that shows a case the guard then refuses is worse than no list at all.
//
// Rulings only, because a fine is appealed by ruling appeal rather than
// verdict appeal. On the defence side only the latest verdict counts, and the
// verdicts come newest first from the case include graph; a review decision to
// appeal stands whatever verdicts follow it.
//
// Closing a defendant without enforcement does not withdraw their appeal, so it
// does not take the case away here either - see
// buildHasAppealedVerdictCondition.
const hasAppealedVerdict = (theCase: Case): boolean =>
  Boolean(
    theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING &&
      theCase.defendants?.some(
        (defendant) =>
          defendant.indictmentReviewDecision ===
            IndictmentCaseReviewDecision.APPEAL ||
          Boolean(defendant.verdicts?.[0]?.appealDate),
      ),
  )

// Prosecutors at the public prosecution office read every appealed verdict,
// not only the cases they reviewed themselves. An appeal can land with a
// prosecutor who had nothing to do with the review, and without this they
// would have to ask a colleague to print the files for them.
//
// Read only. Everything they may change still goes through
// canProsecutionUserAccessCase.
//
// Note that this route does not repeat that function's heightened security
// check. Nothing is exposed by it today - the flag is a plain column on every
// case, but only the request case prosecutor UI ever sets it, and this branch
// is indictment-only - and the case table's access options are silent about it
// too, so list and guard stay in step. An indictment that could carry the flag
// would need both taught about it.
const canPublicProsecutionUserAccessAppealedCase = (theCase: Case): boolean =>
  canPublicProsecutionUserAccessCase(theCase) && hasAppealedVerdict(theCase)

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

const canAppealsCourtUserAccessAppealedCase = (
  appealCase: AppealCase,
): boolean => {
  // Check appeal state access
  if (
    !appealCase.appealState ||
    ![
      AppealCaseState.RECEIVED,
      AppealCaseState.COMPLETED,
      AppealCaseState.WITHDRAWN,
    ].includes(appealCase.appealState)
  ) {
    return false
  }

  if (
    appealCase.appealState === AppealCaseState.WITHDRAWN &&
    !appealCase.appealReceivedByCourtDate
  ) {
    return false
  }

  return true
}

const canAppealsCourtUserAccessCaseAppealCase = (theCase: Case): boolean => {
  if (!theCase.appealCase) {
    return false
  }

  return canAppealsCourtUserAccessAppealedCase(theCase.appealCase)
}

const canAppealsCourtUserAccessCaseRulingOrderAppealCase = (
  theCase: Case,
): boolean => {
  if (!theCase.rulingOrderAppealCases?.length) {
    return false
  }

  return theCase.rulingOrderAppealCases.some((rulingOrderAppealCase) =>
    canAppealsCourtUserAccessAppealedCase(rulingOrderAppealCase),
  )
}

const canAppealsCourtUserAccessRequestCase = (theCase: Case): boolean => {
  return canAppealsCourtUserAccessCaseAppealCase(theCase)
}

const canAppealsCourtUserAccessIndictmentCase = (theCase: Case): boolean => {
  return (
    canAppealsCourtUserAccessCaseAppealCase(theCase) ||
    canAppealsCourtUserAccessCaseRulingOrderAppealCase(theCase)
  )
}

const canAppealsCourtUserAccessCase = (theCase: Case): boolean => {
  // Request cases
  if (isRequestCase(theCase.type)) {
    return canAppealsCourtUserAccessRequestCase(theCase)
  }

  // Indictment cases — only dismissed cases can be appealed
  if (isIndictmentCase(theCase.type)) {
    return canAppealsCourtUserAccessIndictmentCase(theCase)
  }

  return false
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

    // Check indictment case review decision access or if a defendant
    // has been sent to the prison admin
    if (
      !theCase.defendants?.some(
        (defendant) =>
          defendant.isSentToPrisonAdmin &&
          defendant.indictmentReviewDecision ===
            IndictmentCaseReviewDecision.ACCEPT,
      )
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

  // Check case defender assignment
  return (
    theCase.defenderNationalId && theCase.defenderNationalId === user.nationalId
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

  // Check received case access - defence users get access once an arraignment
  // has been scheduled, or once the court has decided not to summon to one
  const canDefenderAccessReceivedCase = Boolean(
    DateLog.arraignmentDate(theCase.dateLogs) ||
      theCase.isArraignmentSummonsSkipped,
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
    if (canProsecutionUserAccessCase(theCase, user, forUpdate)) {
      return true
    }

    // Falls through rather than replacing the check above - a public
    // prosecution user keeps everything the ordinary rule already gave them.
    return (
      !forUpdate &&
      isPublicProsecutionUser(user) &&
      canPublicProsecutionUserAccessAppealedCase(theCase)
    )
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
