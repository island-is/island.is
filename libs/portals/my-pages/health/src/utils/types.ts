import {
  HealthDirectoratePrescription,
  HealthDirectoratePrescriptionDocument,
} from '@island.is/api/schema'

export interface FormData {
  selectedChoice?: string
  selectedLimitations?: string[] // is array because it can have multiple values in the future
  otherLimitations?: string
}
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
  noDataMessage?: string
}

export interface PrescriptionItem extends HealthDirectoratePrescription {
  documents?: HealthDirectoratePrescriptionDocument[]
}

export interface DataState<T> {
  data?: T | null
  loading?: boolean
  error?: boolean
}
