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
const restrictionCaseState: CaseTableColumn = { title: 'Staða' }
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

export const caseTableColumns = {
  caseNumber,
  defendants,
  caseType,
  appealState,
  courtOfAppealsHead,
  validFromTo,
  rulingDate,
  restrictionCaseState,
  rulingType,
  punishmentType,
  prisonAdminReceivalDate,
  prisonAdminState,
  indictmentAppealDeadline,
  subpoenaServiceState,
  indictmentReviewer,
  sentToPrisonAdminDate,
  indictmentReviewDecision,
}

export type CaseTableColumnMap = typeof caseTableColumns
export type CaseTableColumnKey = keyof CaseTableColumnMap
