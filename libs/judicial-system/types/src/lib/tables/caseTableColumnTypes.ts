export interface CaseTableColumn {
  title: string
}
const caseNumber: CaseTableColumn = { title: 'Málsnúmer' }
const defendants: CaseTableColumn = { title: 'Varnaraðili' }
const caseType: CaseTableColumn = { title: 'Tegund' }
const appealState: CaseTableColumn = { title: 'Staða' }
const courtOfAppealsHead: CaseTableColumn = { title: 'Dómsformaður' }
const validFromTo: CaseTableColumn = { title: 'Gildistími' }
const rulingDate: CaseTableColumn = { title: 'Úrskurðardagur' }
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
const indictmentReviewDecision: CaseTableColumn = {
  title: 'Ákvörðun saksóknara',
}
const caseSentToCourtDate: CaseTableColumn = { title: 'Útgáfudagur' }
const arraignmentDate: CaseTableColumn = { title: 'Fyrirtaka' }
const indictmentArraignmentDate: CaseTableColumn = { title: 'Fyrirtaka' }
const indictmentRulingDecision: CaseTableColumn = { title: 'Niðurstaða' }
const created: CaseTableColumn = { title: 'Stofnað' }
const prosecutor: CaseTableColumn = { title: 'Ákærandi' }

export const caseTableColumns = {
  caseNumber,
  defendants,
  caseType,
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
  indictmentReviewDecision,
  caseSentToCourtDate,
  arraignmentDate,
  indictmentCaseState,
  indictmentArraignmentDate,
  indictmentRulingDecision,
  created,
  prosecutor,
}

export type CaseTableColumnMap = typeof caseTableColumns
export type CaseTableColumnKey = keyof CaseTableColumnMap
