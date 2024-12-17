export type DocumentsListTypes = {
  documentsList?: DocumentsListItemTypes[]
}

export type DocumentsListItemTypes = {
  id: string
  date: string
  type: string
  note?: string | null
  sender: string
  dateOpen: string
  amount: number
}

export type DocumentDataTypes = {
  type: string
  document: string
}

export type DocumentTypes = {
  docment: DocumentDataTypes
}
