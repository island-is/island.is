export interface CaseTableColumn {
  title: string
}

const caseNumber: CaseTableColumn = { title: 'Málsnrúmer' }
const defendants: CaseTableColumn = { title: 'Varnaraðili' }
const caseType: CaseTableColumn = { title: 'Tegund' }
const appealState: CaseTableColumn = { title: 'Staða' }
const courtOfAppealsHead: CaseTableColumn = { title: 'Dómsformaður' }
const validFromTo: CaseTableColumn = { title: 'Gildistími' }

export const caseTableColumns = {
  caseNumber,
  defendants,
  caseType,
  appealState,
  courtOfAppealsHead,
  validFromTo,
}

export type CaseTableColumnMap = typeof caseTableColumns
export type CaseTableColumnKey = keyof CaseTableColumnMap
