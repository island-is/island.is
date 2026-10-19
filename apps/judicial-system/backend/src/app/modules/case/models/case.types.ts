import type { Case } from '../../repository'

export type MinimalCase = Omit<
  Case,
  | 'defendants'
  | 'prosecutor'
  | 'creatingProsecutor'
  | 'court'
  | 'registrar'
  | 'judge'
  | 'parentCase'
  | 'childCase'
  | 'caseFiles'
  | 'notifications'
  | 'eventLogs'
  | 'dateLogs'
  | 'caseStrings'
  | 'mergedCases'
  | 'mergeCase'
  | 'prosecutorsOffice'
  | 'sharedWithProsecutorsOffice'
  | 'courtRecordSignatory'
  | 'indictmentReviewer'
  | 'appealProsecutor'
  | 'indictmentApprover'
  | 'civilClaimants'
  | 'victims'
>

// The associations of Case that an update does not read back - the
// complement of updatedCaseInclude in the repository. A value as well as a
// type so that the response of an update route can be bounded to the same
// list at runtime.
export const updatedCaseOmittedAssociations = [
  'creatingProsecutor',
  'sharedWithProsecutorsOffice',
  'courtRecordSignatory',
  'indictmentReviewer',
  'appealProsecutor',
  'indictmentApprover',
  'parentCase',
  'childCase',
  'caseDefendantPoliceCaseNumbers',
  'indictmentCounts',
  'courtSessions',
  'unfiledCourtDocuments',
  'eventLogs',
  'caseStrings',
  'notifications',
  'mergeCase',
  'mergedCases',
  'victims',
  'splitCase',
  'splitCases',
  'verdictAppealCase',
  'rulingOrderAppealCases',
] as const

// The case as it is read back right after an update: the graph
// updatedCaseInclude in the repository lists and nothing else. Narrower than
// Case so that reading an association the reload does not carry fails to
// compile instead of silently finding undefined. Widen the include and this
// type together.
export type UpdatedCase = Omit<
  Case,
  typeof updatedCaseOmittedAssociations[number]
>
