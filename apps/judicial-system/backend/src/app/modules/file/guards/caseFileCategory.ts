import {
  CaseFileCategory,
  CaseState,
  CaseType,
  DefendantEventType,
  isCompletedCase,
  isDefenceUser,
  isIndictmentCase,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isRequestCase,
  User,
} from '@island.is/judicial-system/types'

import {
  CivilClaimant,
  CourtSession,
  Defendant,
  DefendantEventLog,
} from '../../repository'
import { canDefenceUserViewCivilClaimCaseFile } from './civilClaimFileVisibility'

// A ruling order uploaded during the course of a case is only visible to
// parties (everyone except district-court users) once it has been added to a
// court session that has been confirmed. The court session's end date is used
// for the ruling time and deadlines.
export const isRulingOrderInConfirmedCourtSession = (
  fileId: string,
  courtSessions?: CourtSession[],
): boolean =>
  Boolean(
    courtSessions?.some(
      (session) => session.isConfirmed && session.rulingFileId === fileId,
    ),
  )

const defenderCaseFileCategoriesForRequestCases = [
  CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
  CaseFileCategory.APPEAL_RULING,
  CaseFileCategory.APPEAL_COURT_RECORD,
]

const defenderDefaultCaseFileCategoriesForIndictmentCases = [
  CaseFileCategory.COURT_RECORD,
  CaseFileCategory.RULING,
]

const defenderCaseFileCategoriesForIndictmentCases =
  defenderDefaultCaseFileCategoriesForIndictmentCases.concat(
    CaseFileCategory.CRIMINAL_RECORD,
    CaseFileCategory.CRIMINAL_RECORD_UPDATE,
    CaseFileCategory.COST_BREAKDOWN,
    CaseFileCategory.CASE_FILE,
    CaseFileCategory.PROSECUTOR_CASE_FILE,
    CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
    CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
    CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
    CaseFileCategory.DEFENDANT_CASE_FILE,
    CaseFileCategory.CIVIL_CLAIM,
    // Appeal file categories — in indictment cases, all appeal files are
    // visible to defence users (unlike request cases where prosecution
    // case files are hidden)
    CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
    CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
    CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
    CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
    CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
    CaseFileCategory.APPEAL_RULING,
    CaseFileCategory.APPEAL_COURT_RECORD,
  )

const prisonAdminCaseFileCategories = [
  CaseFileCategory.APPEAL_RULING,
  CaseFileCategory.RULING,
  CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
  CaseFileCategory.COURT_RECORD,
  CaseFileCategory.CRIMINAL_RECORD_UPDATE,
]

const prisonStaffCaseFileCategories = [CaseFileCategory.APPEAL_RULING]

export const getDefenceUserCutoffDate = (
  nationalId: string,
  defendants?: Defendant[],
  civilClaimants?: CivilClaimant[],
): Date | undefined => {
  if (
    CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(
      nationalId,
      civilClaimants,
    )
  ) {
    return undefined
  }

  const myDefendants = defendants?.filter(
    (defendant) =>
      defendant.isDefenderChoiceConfirmed &&
      defendant.defenderNationalId === nationalId,
  )

  if (!myDefendants?.length) {
    return undefined
  }

  const dismissalEvents = myDefendants.map((defendant) =>
    DefendantEventLog.getEventLogByEventType(
      [
        DefendantEventType.INDICTMENT_CANCELLED,
        DefendantEventType.INDICTMENT_DISMISSED,
      ],
      defendant.eventLogs,
    ),
  )

  if (!dismissalEvents.every(Boolean)) {
    return undefined
  }

  return dismissalEvents.reduce<Date | undefined>((latest, event) => {
    if (!event) return latest
    if (!latest) return event.created
    return event.created > latest ? event.created : latest
  }, undefined)
}

const canDefenceUserViewCaseFileOfRequestCase = (
  caseState: CaseState,
  caseFileCategory: CaseFileCategory,
) => {
  return (
    isCompletedCase(caseState) &&
    defenderCaseFileCategoriesForRequestCases.includes(caseFileCategory)
  )
}

const getDefenceUserIndictmentCaseFileCategories = (
  nationalId: string,
  defendants?: Defendant[],
  civilClaimants?: CivilClaimant[],
) => {
  if (
    Defendant.isConfirmedDefenderOfDefendantWithCaseFileAccess(
      nationalId,
      defendants,
    ) ||
    CivilClaimant.isConfirmedSpokespersonOfCivilClaimantWithCaseFileAccess(
      nationalId,
      civilClaimants,
    )
  ) {
    return defenderCaseFileCategoriesForIndictmentCases
  }

  return defenderDefaultCaseFileCategoriesForIndictmentCases
}

const canDefenceUserViewCaseFileOfIndictmentCase = (
  nationalId: string,
  caseFileCategory: CaseFileCategory,
  defendants?: Defendant[],
  civilClaimants?: CivilClaimant[],
) => {
  const allowedCaseFileCategories = getDefenceUserIndictmentCaseFileCategories(
    nationalId,
    defendants,
    civilClaimants,
  )

  return allowedCaseFileCategories.includes(caseFileCategory)
}

const canDefenceUserViewCaseFile = ({
  nationalId,
  userName,
  caseType,
  caseState,
  submittedBy,
  fileRepresentative,
  caseFileCategory,
  defendants,
  civilClaimants,
  defendantId,
  civilClaimantId,
  fileCreated,
  isRulingOrderInConfirmedCourtSession,
}: {
  nationalId: string
  userName: string
  caseType: CaseType
  caseState: CaseState
  submittedBy?: string
  fileRepresentative?: string
  caseFileCategory: CaseFileCategory
  defendants?: Defendant[]
  civilClaimants?: CivilClaimant[]
  defendantId?: string
  civilClaimantId?: string | null
  fileCreated?: Date
  isRulingOrderInConfirmedCourtSession?: boolean
}) => {
  if (isRequestCase(caseType)) {
    return canDefenceUserViewCaseFileOfRequestCase(caseState, caseFileCategory)
  }

  if (isIndictmentCase(caseType)) {
    const cutoffDate = getDefenceUserCutoffDate(
      nationalId,
      defendants,
      civilClaimants,
    )

    if (cutoffDate && fileCreated && fileCreated > cutoffDate) {
      return false
    }

    // A ruling order uploaded during the course of a case is only visible once
    // it has been added to a confirmed court session.
    if (caseFileCategory === CaseFileCategory.COURT_INDICTMENT_RULING_ORDER) {
      return Boolean(isRulingOrderInConfirmedCourtSession)
    }

    if (
      (caseFileCategory === CaseFileCategory.CRIMINAL_RECORD ||
        caseFileCategory === CaseFileCategory.CRIMINAL_RECORD_UPDATE) &&
      defendantId
    ) {
      if (
        !Defendant.isConfirmedDefenderOfSpecificDefendantWithCaseFileAccess(
          nationalId,
          defendantId,
          defendants,
        )
      ) {
        return false
      }
    }

    // TODO: This is not optimal as we can have multiple users that have identical names.
    // It is unlikely that a defenders with identical user names have been assigned to the same case but we should remove that possibility for sure.
    // Since defenders aren't registered in the system we should rather rely on the user's national id when submitting a file
    const hasUserSubmittedCaseFile =
      (submittedBy || fileRepresentative) &&
      (userName === submittedBy || userName === fileRepresentative)

    const categoryAllowed =
      canDefenceUserViewCaseFileOfIndictmentCase(
        nationalId,
        caseFileCategory,
        defendants,
        civilClaimants,
      ) || hasUserSubmittedCaseFile

    if (!categoryAllowed) {
      return false
    }

    return canDefenceUserViewCivilClaimCaseFile(nationalId, {
      category: caseFileCategory,
      civilClaimantId,
      defendants,
      civilClaimants,
    })
  }

  return false
}

const canPrisonStaffUserViewCaseFile = (
  caseState: CaseState,
  caseFileCategory: CaseFileCategory,
) => {
  return (
    isCompletedCase(caseState) &&
    prisonStaffCaseFileCategories.includes(caseFileCategory)
  )
}

const canPrisonAdminUserViewCaseFile = (
  caseState: CaseState,
  caseFileCategory: CaseFileCategory,
) => {
  return (
    isCompletedCase(caseState) &&
    prisonAdminCaseFileCategories.includes(caseFileCategory)
  )
}

export const canLimitedAccessUserViewCaseFile = ({
  user,
  caseType,
  caseState,
  caseFileCategory,
  submittedBy,
  fileRepresentative,
  defendants,
  civilClaimants,
  defendantId,
  civilClaimantId,
  fileCreated,
  isRulingOrderInConfirmedCourtSession,
}: {
  user: User
  caseType: CaseType
  caseState: CaseState
  caseFileCategory?: CaseFileCategory
  submittedBy?: string
  fileRepresentative?: string
  defendants?: Defendant[]
  civilClaimants?: CivilClaimant[]
  defendantId?: string
  civilClaimantId?: string | null
  fileCreated?: Date
  isRulingOrderInConfirmedCourtSession?: boolean
}) => {
  if (!caseFileCategory) {
    return false
  }

  if (isDefenceUser(user)) {
    return canDefenceUserViewCaseFile({
      nationalId: user.nationalId,
      userName: user.name,
      caseType,
      caseState,
      submittedBy,
      fileRepresentative,
      caseFileCategory,
      defendants,
      civilClaimants,
      defendantId,
      civilClaimantId,
      fileCreated,
      isRulingOrderInConfirmedCourtSession,
    })
  }

  if (isPrisonStaffUser(user)) {
    return canPrisonStaffUserViewCaseFile(caseState, caseFileCategory)
  }

  if (isPrisonAdminUser(user)) {
    return canPrisonAdminUserViewCaseFile(caseState, caseFileCategory)
  }

  return false
}

export const getDefenceUserCaseFileCategories = (
  nationalId: string,
  caseType: CaseType,
  defendants?: Defendant[],
  civilClaimants?: CivilClaimant[],
) => {
  if (isRequestCase(caseType)) {
    return defenderCaseFileCategoriesForRequestCases
  }

  return getDefenceUserIndictmentCaseFileCategories(
    nationalId,
    defendants,
    civilClaimants,
  )
}

export const getDefenderVisiblePoliceCaseNumbers = (
  userNationalId: string,
  defendants: Defendant[] | undefined,
  allPoliceCaseNumbers: string[],
): string[] => {
  const allAssigned = new Set(
    (defendants ?? []).flatMap((d) => d.policeCaseNumbers ?? []),
  )

  if (allAssigned.size === 0) {
    return allPoliceCaseNumbers
  }

  const myDefendants = (defendants ?? []).filter(
    (d) =>
      d.isDefenderChoiceConfirmed && d.defenderNationalId === userNationalId,
  )

  const assignedToMe = new Set(
    myDefendants.flatMap((d) => d.policeCaseNumbers ?? []),
  )

  return allPoliceCaseNumbers.filter(
    (pcn) => assignedToMe.has(pcn) || !allAssigned.has(pcn),
  )
}

export const getSpokespersonVisiblePoliceCaseNumbers = (
  userNationalId: string,
  civilClaimants: CivilClaimant[] | undefined,
  defendants: Defendant[] | undefined,
  allPoliceCaseNumbers: string[],
): string[] => {
  const myClaimants = (civilClaimants ?? []).filter(
    (civilClaimant) =>
      civilClaimant.hasSpokesperson &&
      civilClaimant.isSpokespersonConfirmed &&
      civilClaimant.caseFilesSharedWithSpokesperson &&
      civilClaimant.spokespersonNationalId === userNationalId,
  )

  if (myClaimants.length === 0) {
    return []
  }

  if (myClaimants.some((civilClaimant) => !civilClaimant.policeCaseNumbers?.length)) {
    return allPoliceCaseNumbers
  }

  const assignedToMe = new Set(
    myClaimants.flatMap((civilClaimant) => civilClaimant.policeCaseNumbers ?? []),
  )

  const allAssignedToDefendants = new Set(
    (defendants ?? []).flatMap((defendant) => defendant.policeCaseNumbers ?? []),
  )

  if (allAssignedToDefendants.size === 0) {
    return allPoliceCaseNumbers
  }

  return allPoliceCaseNumbers.filter(
    (policeCaseNumber) =>
      assignedToMe.has(policeCaseNumber) ||
      !allAssignedToDefendants.has(policeCaseNumber),
  )
}

export const getDefenceUserVisiblePoliceCaseNumbers = (
  userNationalId: string,
  defendants: Defendant[] | undefined,
  civilClaimants: CivilClaimant[] | undefined,
  allPoliceCaseNumbers: string[],
): string[] => {
  const isDefender = Defendant.isConfirmedDefenderOfDefendant(
    userNationalId,
    defendants,
  )
  const isSpokesperson =
    CivilClaimant.isConfirmedSpokespersonOfCivilClaimantWithCaseFileAccess(
      userNationalId,
      civilClaimants,
    )

  if (!isDefender && !isSpokesperson) {
    return allPoliceCaseNumbers
  }

  const visibleNumbers = new Set<string>()

  if (isDefender) {
    for (const policeCaseNumber of getDefenderVisiblePoliceCaseNumbers(
      userNationalId,
      defendants,
      allPoliceCaseNumbers,
    )) {
      visibleNumbers.add(policeCaseNumber)
    }
  }

  if (isSpokesperson) {
    for (const policeCaseNumber of getSpokespersonVisiblePoliceCaseNumbers(
      userNationalId,
      civilClaimants,
      defendants,
      allPoliceCaseNumbers,
    )) {
      visibleNumbers.add(policeCaseNumber)
    }
  }

  return allPoliceCaseNumbers.filter((policeCaseNumber) =>
    visibleNumbers.has(policeCaseNumber),
  )
}

export const getConfirmedDefendantsForDefender = (
  userNationalId: string,
  defendants?: Defendant[],
): Defendant[] => {
  return (defendants ?? []).filter(
    (defendant) =>
      defendant.isDefenderChoiceConfirmed &&
      defendant.defenderNationalId === userNationalId,
  )
}

export const isConfirmedDefenderOfSpecificDefendant = (
  userNationalId: string,
  defendantId: string,
  defendants?: Defendant[],
): boolean =>
  getConfirmedDefendantsForDefender(userNationalId, defendants).some(
    (defendant) => defendant.id === defendantId,
  )
