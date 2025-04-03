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

import { CivilClaimant, Defendant } from '../../defendant'

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
    CaseFileCategory.COST_BREAKDOWN,
    CaseFileCategory.CASE_FILE,
    CaseFileCategory.PROSECUTOR_CASE_FILE,
    CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
    CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
    CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
    CaseFileCategory.DEFENDANT_CASE_FILE,
    CaseFileCategory.CIVIL_CLAIM,
  )

const prisonAdminCaseFileCategories = [
  CaseFileCategory.APPEAL_RULING,
  CaseFileCategory.RULING,
  CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
  CaseFileCategory.COURT_RECORD,
  CaseFileCategory.CRIMINAL_RECORD_UPDATE,
]

const prisonStaffCaseFileCategories = [CaseFileCategory.APPEAL_RULING]

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
    )
  ) {
    return defenderCaseFileCategoriesForIndictmentCases
  }

  if (
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

const canDefenceUserViewCaseFile = (
  nationalId: string,
  caseType: CaseType,
  caseState: CaseState,
  caseFileCategory: CaseFileCategory,
  defendants?: Defendant[],
  civilClaimants?: CivilClaimant[],
) => {
  if (isRequestCase(caseType)) {
    return canDefenceUserViewCaseFileOfRequestCase(caseState, caseFileCategory)
  }

  if (isIndictmentCase(caseType)) {
    return canDefenceUserViewCaseFileOfIndictmentCase(
      nationalId,
      caseFileCategory,
      defendants,
      civilClaimants,
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

export const canLimitedAccessUserViewCaseFile = (
  user: User,
  caseType: CaseType,
  caseState: CaseState,
  caseFileCategory?: CaseFileCategory,
  defendants?: Defendant[],
  civilClaimants?: CivilClaimant[],
) => {
  console.log({ caseFileCategory })
  if (!caseFileCategory) {
    return false
  }

  if (isDefenceUser(user)) {
    const test = canDefenceUserViewCaseFile(
      user.nationalId,
      caseType,
      caseState,
      caseFileCategory,
      defendants,
      civilClaimants,
    )
    console.log({ test })
    return test
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
