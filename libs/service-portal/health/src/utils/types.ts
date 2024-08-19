export type DetailRow = {
  value: string
  type?: 'link' | 'text'
  url?: string
}

export type DetailHeader = {
  value: string | React.ReactElement
  align?: 'left' | 'right'
}

export interface DetailTable {
  headerData: Array<DetailHeader>
  rowData?: Array<Array<DetailRow>>
  footerText: Array<string>
}
