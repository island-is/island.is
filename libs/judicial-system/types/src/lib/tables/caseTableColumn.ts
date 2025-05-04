export enum CaseTableColumnType {
  STRING_LIST = 'STRING_LIST',
}

export interface CaseTableColumn {
  title: string
  type: CaseTableColumnType
}

export const caseNumber: CaseTableColumn = {
  title: 'Málsnrúmer',
  type: CaseTableColumnType.STRING_LIST,
}
export const defendants: CaseTableColumn = {
  title: 'Varnaraðili',
  type: CaseTableColumnType.STRING_LIST,
}
export const caseType: CaseTableColumn = {
  title: 'Tegund',
  type: CaseTableColumnType.STRING_LIST,
}
export const caseState: CaseTableColumn = {
  title: 'Staða',
  type: CaseTableColumnType.STRING_LIST,
}
export const courtOfAppealsHead: CaseTableColumn = {
  title: 'Dómsformaður',
  type: CaseTableColumnType.STRING_LIST,
}
export const validFromTo: CaseTableColumn = {
  title: 'Gildistími',
  type: CaseTableColumnType.STRING_LIST,
}
