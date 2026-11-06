export interface CaseTableColumn {
  title: string
}
const caseNumber: CaseTableColumn = { title: 'Málsnúmer' }
const defendants: CaseTableColumn = { title: 'Varnaraðili' }
const caseType: CaseTableColumn = { title: 'Tegund' }
const appealCaseType: CaseTableColumn = { title: 'Tegund' }
const appealState: CaseTableColumn = { title: 'Staða' }
const courtOfAppealsHead: CaseTableColumn = { title: 'Dómsformaður' }
const validFromTo: CaseTableColumn = { title: 'Gildistími' }
const rulingDate: CaseTableColumn = { title: 'Máli lokið' }
const requestCaseState: CaseTableColumn = { title: 'Staða' }
const indictmentCaseState: CaseTableColumn = { title: 'Staða' }
const appealCaseState: CaseTableColumn = { title: 'Landsréttur' }
const rulingType: CaseTableColumn = { title: 'Tegund' }
const punishmentType: CaseTableColumn = { title: 'Refsitegund' }
const prisonAdminReceivalDate: CaseTableColumn = { title: 'Móttökudagsetning' }
const prisonAdminState: CaseTableColumn = { title: 'Staða' }
const indictmentAppealDeadline: CaseTableColumn = { title: 'Frestur' }
const subpoenaServiceState: CaseTableColumn = { title: 'Birtingarstaða' }
const indictmentReviewer: CaseTableColumn = { title: 'Saksóknari' }
const sentToPrisonAdminDate: CaseTableColumn = { title: 'Sent til fullnustu' }
const closedWithoutEnforcementDate: CaseTableColumn = {
  title: 'Lokið án fullnustu',
}
const indictmentReviewDecision: CaseTableColumn = {
  title: 'Ákvörðun saksóknara',
}
const caseSentToCourtDate: CaseTableColumn = { title: 'Útgáfudagur' }
const arraignmentDate: CaseTableColumn = { title: 'Fyrirtaka' }
const indictmentArraignmentDate: CaseTableColumn = { title: 'Fyrirtaka' }
const indictmentRulingDecision: CaseTableColumn = { title: 'Niðurstaða' }
// Used on tables with a separate appeal state column to avoid showing the
// appeal state twice
const indictmentRulingDecisionWithoutAppealState: CaseTableColumn = {
  title: 'Niðurstaða',
}
const created: CaseTableColumn = { title: 'Stofnað' }
const prosecutor: CaseTableColumn = { title: 'Ákærandi' }
const prosecutorInitials: CaseTableColumn = { title: 'Ákærandi' }
// The verdict appeal columns read the case's verdict appeal, not its ruling
// appeal, so they cannot share the appealCase-backed columns above even where
// the title is the same.
const verdictAppealCaseNumber: CaseTableColumn = { title: 'Málsnúmer' }
const districtCourtRulingDate: CaseTableColumn = { title: 'Dómur héraðsdóms' }
const verdictAppealAppellant: CaseTableColumn = { title: 'Áfrýjað af' }
const verdictAppealState: CaseTableColumn = { title: 'Staða' }
const verdictAppealHead: CaseTableColumn = { title: 'Dómsformaður' }
const verdictAppealCompletedDate: CaseTableColumn = { title: 'Máli lokið' }
const verdictAppealResult: CaseTableColumn = { title: 'Niðurstaða' }

export const caseTableColumns = {
  caseNumber,
  defendants,
  caseType,
  appealCaseType,
  appealState,
  courtOfAppealsHead,
  validFromTo,
  rulingDate,
  requestCaseState,
  appealCaseState,
  rulingType,
  punishmentType,
  prisonAdminReceivalDate,
  prisonAdminState,
  indictmentAppealDeadline,
  subpoenaServiceState,
  indictmentReviewer,
  sentToPrisonAdminDate,
  closedWithoutEnforcementDate,
  indictmentReviewDecision,
  caseSentToCourtDate,
  arraignmentDate,
  indictmentCaseState,
  indictmentArraignmentDate,
  indictmentRulingDecision,
  indictmentRulingDecisionWithoutAppealState,
  created,
  prosecutor,
  prosecutorInitials,
  verdictAppealCaseNumber,
  districtCourtRulingDate,
  verdictAppealAppellant,
  verdictAppealState,
  verdictAppealHead,
  verdictAppealCompletedDate,
  verdictAppealResult,
}

export type CaseTableColumnMap = typeof caseTableColumns
export type CaseTableColumnKey = keyof CaseTableColumnMap
