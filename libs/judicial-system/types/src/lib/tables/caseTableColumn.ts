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
}

export type CaseTableColumnMap = typeof caseTableColumns
export type CaseTableColumnKey = keyof CaseTableColumnMap
