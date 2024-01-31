import { CaseFileCategory } from '@island.is/judicial-system/types'

export const defenderCaseFileCategoriesForRestrictionAndInvestigationCases = [
  CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
  CaseFileCategory.APPEAL_RULING,
]

export const defenderCaseFileCategoriesForIndictmentCases = [
  CaseFileCategory.COURT_RECORD,
  CaseFileCategory.RULING,
  CaseFileCategory.COVER_LETTER,
  CaseFileCategory.INDICTMENT,
  CaseFileCategory.CRIMINAL_RECORD,
  CaseFileCategory.COST_BREAKDOWN,
  CaseFileCategory.CASE_FILE,
]
