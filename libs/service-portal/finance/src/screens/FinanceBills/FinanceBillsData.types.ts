export type BillReceiptTypes = {
  documentsList?: BillReceiptItemTypes[]
}

export type BillReceiptItemTypes = {
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
