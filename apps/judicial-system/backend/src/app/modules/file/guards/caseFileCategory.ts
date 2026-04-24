import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
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

import { CivilClaimant, Defendant, DefendantEventLog } from '../../repository'

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
  CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
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
      defendant.defenderNationalId &&
      normalizeAndFormatNationalId(nationalId).includes(
        defendant.defenderNationalId,
      ),
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
  fileCreated,
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
  fileCreated?: Date
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

    return (
      canDefenceUserViewCaseFileOfIndictmentCase(
        nationalId,
        caseFileCategory,
        defendants,
        civilClaimants,
      ) || hasUserSubmittedCaseFile
    )
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
  fileCreated,
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
  fileCreated?: Date
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
      fileCreated,
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
