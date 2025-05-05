export enum CaseTableColumnType {
  STRING_LIST = 'STRING_LIST',
}

export interface CaseTableColumn {
  title: string
  type: CaseTableColumnType
}

const caseNumber: CaseTableColumn = {
  title: 'Málsnrúmer',
  type: CaseTableColumnType.STRING_LIST,
}
const defendants: CaseTableColumn = {
  title: 'Varnaraðili',
  type: CaseTableColumnType.STRING_LIST,
}
const caseType: CaseTableColumn = {
  title: 'Tegund',
  type: CaseTableColumnType.STRING_LIST,
}
const caseState: CaseTableColumn = {
  title: 'Staða',
  type: CaseTableColumnType.STRING_LIST,
}
const courtOfAppealsHead: CaseTableColumn = {
  title: 'Dómsformaður',
  type: CaseTableColumnType.STRING_LIST,
}
const validFromTo: CaseTableColumn = {
  title: 'Gildistími',
  type: CaseTableColumnType.STRING_LIST,
}

export const caseTableColumns = {
  caseNumber,
  defendants,
  caseType,
  caseState,
  courtOfAppealsHead,
  validFromTo,
}

export type CaseTableColumnMap = typeof caseTableColumns
export type CaseTableColumnKey = keyof CaseTableColumnMap
