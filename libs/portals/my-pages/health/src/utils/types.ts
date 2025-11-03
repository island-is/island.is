import {
  HealthDirectoratePrescription,
  HealthDirectoratePrescriptionDocument,
  RightsPortalCalculatorRequestInput,
  RightsPortalHealthCenter,
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

export interface DelegationState {
  dateFrom?: Date
  dateTo?: Date
  nationalId?: string
  lookup?: boolean
}
export type DrugRowDrug = {
  name?: string | null
  strength?: string | null
  totalPrice?: number | null
  totalPaidIndividual?: number | null
}

export type RightsPortalCalculatorSelectedDrug =
  RightsPortalCalculatorRequestInput & DrugRowDrug

export type SelectedHealthCenter = Pick<RightsPortalHealthCenter, 'id' | 'name'>

export type HealthCenterDoctorOption = {
  label: string
  value: number
}
