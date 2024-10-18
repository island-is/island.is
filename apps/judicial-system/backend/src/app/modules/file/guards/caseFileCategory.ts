import {
  CaseFileCategory,
  CaseState,
  CaseType,
  isCompletedCase,
  isDefenceUser,
  isIndictmentCase,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isRequestCase,
  User,
} from '@island.is/judicial-system/types'

export const defenderCaseFileCategoriesForRestrictionAndInvestigationCases = [
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

const defenderCaseFileCategoriesForIndictmentCases = [
  CaseFileCategory.COURT_RECORD,
  CaseFileCategory.RULING,
  CaseFileCategory.INDICTMENT,
  CaseFileCategory.CRIMINAL_RECORD,
  CaseFileCategory.COST_BREAKDOWN,
  CaseFileCategory.CASE_FILE,
  CaseFileCategory.PROSECUTOR_CASE_FILE,
  CaseFileCategory.DEFENDANT_CASE_FILE,
  CaseFileCategory.CIVIL_CLAIM,
]

const prisonAdminCaseFileCategories = [
  CaseFileCategory.APPEAL_RULING,
  CaseFileCategory.RULING,
]

const prisonStaffCaseFileCategories = [CaseFileCategory.APPEAL_RULING]

export const canLimitedAcccessUserViewCaseFile = (
  user: User,
  caseType: CaseType,
  caseState: CaseState,
  caseFileCategory?: CaseFileCategory,
) => {
  if (!caseFileCategory) {
    return false
  }

  if (isDefenceUser(user)) {
    if (
      isRequestCase(caseType) &&
      isCompletedCase(caseState) &&
      defenderCaseFileCategoriesForRestrictionAndInvestigationCases.includes(
        caseFileCategory,
      )
    ) {
      return true
    }

    if (
      isIndictmentCase(caseType) &&
      defenderCaseFileCategoriesForIndictmentCases.includes(caseFileCategory)
    ) {
      return true
    }
  }

  if (isCompletedCase(caseState)) {
    if (
      isPrisonStaffUser(user) &&
      prisonStaffCaseFileCategories.includes(caseFileCategory)
    ) {
      return true
    }

    if (
      isPrisonAdminUser(user) &&
      prisonAdminCaseFileCategories.includes(caseFileCategory)
    ) {
      return true
    }
  }

  return false
}
